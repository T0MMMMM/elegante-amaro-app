import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { theme } from '@elegante-amaro-app/shared/constants'
import { commandsService }      from '../services/commands.service'
import { commandItemsService }  from '../services/commandItems.service'
import { stateCommandsService } from '../services/stateCommands.service'
import { tablesService }        from '../services/tables.service'
import { itemsService }         from '../services/items.service'
import { commandTypesService }  from '../services/commandTypes.service'
import type { StateCommand } from '@elegante-amaro-app/shared/types'

interface BoardOrder {
  id: number
  table: number | null
  isTakeaway: boolean
  statusId: number
  items: string[]
  createdAt: Date
  total: number
}

function elapsed(createdAt: Date, now: Date) {
  return Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / 60_000))
}

const today = () => new Date().toDateString()

export default function CommandsBoard() {
  const navigate = useNavigate()
  const [orders, setOrders]   = useState<BoardOrder[]>([])
  const [states, setStates]   = useState<StateCommand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [now, setNow]         = useState(new Date())

  const load = useCallback(async () => {
    try {
      const [commands, stateCommands, tables, allCmdItems, allItems, commandTypes] = await Promise.all([
        commandsService.getAll(),
        stateCommandsService.getAll(),
        tablesService.getAll(true),
        commandItemsService.getAll(),
        itemsService.getAll(true),
        commandTypesService.getAll(),
      ])

      setStates(stateCommands)

      const enriched: BoardOrder[] = commands.map(cmd => {
        const table    = tables.find(t => t.id === cmd.table_id)
        const type     = commandTypes.find(t => t.id === cmd.type_id)
        const cmdItems = allCmdItems.filter(ci => ci.command_id === cmd.id)
        const labels   = cmdItems.map(ci => {
          const item = allItems.find(i => i.id === ci.item_id)
          return ci.quantity > 1 ? `${item?.name ?? '?'} × ${ci.quantity}` : (item?.name ?? '?')
        })
        return {
          id: cmd.id,
          table: table?.numero ?? null,
          isTakeaway: type?.name !== 'sur place',
          statusId: cmd.state_command_id,
          items: labels,
          createdAt: new Date(cmd.created_at),
          total: cmd.total_price,
        }
      })

      setOrders(enriched)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const tick = setInterval(() => { setNow(new Date()); load() }, 5_000)
    return () => clearInterval(tick)
  }, [load])

  // Toutes les colonnes : tous les statuts non masqués, dans leur ordre de position.
  const columns = states.filter(s => !s.hidden_in_board)
  // Séquence "active" utilisée pour avancer/reculer : tous les statuts visibles,
  // dans l'ordre de leur position (entièrement configurable depuis la page Statuts).
  const sequenceStates = columns

  const todayStr = today()

  const setOrderStatus = async (order: BoardOrder, targetId: number) => {
    await commandsService.update(order.id, { state_command_id: targetId })
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, statusId: targetId } : o))
  }

  const moveOrder = (order: BoardOrder, direction: -1 | 1) => {
    const idx = sequenceStates.findIndex(s => s.id === order.statusId)
    if (idx === -1) return Promise.resolve()
    const target = sequenceStates[idx + direction]
    if (!target) return Promise.resolve()
    return setOrderStatus(order, target.id)
  }

  // Indépendant de la visibilité de colonne : un statut masqué du tableau reste
  // utilisable comme raccourci (ex. "annulée" envoyée hors-tableau sans colonne dédiée).
  const quickActionStates = states.filter(s => s.quick_action_enabled)

  if (loading) return (
    <div style={styles.center}><span style={styles.loadingText}>Chargement…</span></div>
  )

  if (error) return (
    <div style={styles.center}><span style={styles.errorText}>{error}</span></div>
  )

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Suivi des commandes</h1>
        <button
          type="button"
          aria-label="Gérer les statuts"
          style={styles.gearButton}
          onClick={() => navigate('/state-commands')}
        >
          ⚙
        </button>
      </div>

      <div style={styles.board}>
        {columns.map(state => {
          const isTerminal = !!state.is_final
          const seqIdx = sequenceStates.findIndex(s => s.id === state.id)

          const rows = orders
            .filter(o => o.statusId === state.id)
            .filter(o => !isTerminal || o.createdAt.toDateString() === todayStr)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

          return (
            <div key={state.id} style={{ ...styles.column, border: `2px solid ${state.color || theme.colors.border}` }}>
              <div style={styles.columnHeader}>
                <span style={styles.columnTitle}>{state.state}</span>
                <span style={styles.columnCount}>{rows.length}</span>
              </div>

              <div style={styles.columnBody}>
                {rows.length === 0 ? (
                  <span style={styles.columnEmpty}>Aucune commande</span>
                ) : (
                  rows.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      now={now}
                      backTarget={seqIdx > 0 ? sequenceStates[seqIdx - 1] : null}
                      forwardTarget={seqIdx !== -1 ? sequenceStates[seqIdx + 1] ?? null : null}
                      onBack={() => moveOrder(order, -1)}
                      onForward={() => moveOrder(order, 1)}
                      quickActions={quickActionStates}
                      onQuickAction={(targetId) => setOrderStatus(order, targetId)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderCard({
  order, now, backTarget, forwardTarget, onBack, onForward, quickActions, onQuickAction,
}: {
  order: BoardOrder
  now: Date
  backTarget: StateCommand | null
  forwardTarget: StateCommand | null
  onBack: () => void
  onForward: () => void
  quickActions: StateCommand[]
  onQuickAction: (targetId: number) => Promise<void> | void
}) {
  const [busy, setBusy] = useState(false)
  const min = elapsed(order.createdAt, now)
  const isLate = min >= 15
  const isWarning = min >= 8

  const handle = async (fn: () => Promise<void> | void) => {
    if (busy) return
    setBusy(true)
    try { await fn() } finally { setBusy(false) }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <span style={styles.cardTable}>
          #{order.id} — {order.isTakeaway ? 'À emporter' : order.table != null ? `Table ${order.table}` : '—'}
        </span>
        <span style={{ ...styles.cardTime, color: isLate ? theme.colors.danger : isWarning ? theme.colors.accent : theme.colors.muted }}>
          {min === 0 ? "À l'instant" : `${min} min`}
        </span>
      </div>
      <div style={styles.cardItems}>
        {order.items.length > 0
          ? order.items.map((label, i) => <div key={i}>{label}</div>)
          : <em>Aucun article</em>}
      </div>
      <span style={styles.cardTotal}>{Number(order.total).toFixed(2)} €</span>

      <div style={styles.cardActionsBlock}>
        <div style={styles.cardArrowsRow}>
          <button
            type="button"
            aria-label="Statut précédent"
            title={backTarget ? backTarget.state : undefined}
            disabled={busy || !backTarget}
            style={{ ...styles.cardArrow, ...(!backTarget ? styles.cardArrowDisabled : null) }}
            onClick={() => handle(onBack)}
          >
            ◀
          </button>
          <button
            type="button"
            aria-label="Statut suivant"
            title={forwardTarget ? forwardTarget.state : undefined}
            disabled={busy || !forwardTarget}
            style={{ ...styles.cardArrow, ...(!forwardTarget ? styles.cardArrowDisabled : null) }}
            onClick={() => handle(onForward)}
          >
            ▶
          </button>
        </div>

          {quickActions.length > 0 && (
            <div style={styles.quickActionsGrid}>
              {quickActions.map((qa, idx) => {
                const isCurrent = qa.id === order.statusId
                const isLoneLast = quickActions.length % 2 === 1 && idx === quickActions.length - 1
                return (
                  <button
                    key={qa.id}
                    type="button"
                    aria-label={qa.state}
                    aria-current={isCurrent}
                    title={isCurrent ? `${qa.state} (statut actuel)` : qa.state}
                    disabled={busy || isCurrent}
                    style={{
                      ...styles.cardQuickAction,
                      backgroundColor: qa.color || theme.colors.border,
                      ...(isLoneLast ? styles.cardQuickActionFull : null),
                      ...(isCurrent ? styles.cardQuickActionCurrent : null),
                    }}
                    onClick={() => handle(() => onQuickAction(qa.id))}
                  >
                    {(qa.icon || qa.state).slice(0, 12)}
                  </button>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  center:      { display: 'flex', justifyContent: 'center', paddingTop: 80 },
  loadingText: { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.muted, letterSpacing: '0.1em', textTransform: 'uppercase' },
  errorText:   { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.danger },

  root:   { height: '100%', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexShrink: 0 },
  pageTitle: { fontFamily: theme.fonts.title, fontSize: 40, color: theme.colors.onPrimary, letterSpacing: '0.04em' },
  gearButton: {
    background: 'none',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 18,
    color: theme.colors.onPrimary,
    padding: '8px 14px',
    lineHeight: 1,
  },

  board: { flex: 1, minHeight: 0, display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 8 },
  column: {
    flex: '1 1 0',
    minWidth: 260,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 8,
    overflow: 'hidden',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  columnTitle: {
    fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.onPrimary,
  },
  columnCount: {
    fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600, color: theme.colors.muted,
  },
  columnBody: { flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 },
  columnEmpty: {
    fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.muted,
    textAlign: 'center', padding: '20px 0',
  },

  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTable: { fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 700, color: theme.colors.onPrimary, letterSpacing: '0.04em' },
  cardTime:  { fontFamily: theme.fonts.ui, fontSize: 11, letterSpacing: '0.04em', whiteSpace: 'nowrap' },
  cardItems: { fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.muted, lineHeight: 1.5 },
  cardTotal: { fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 600, color: theme.colors.onPrimary, marginTop: 2 },

  cardActionsBlock: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 'auto', paddingTop: 8 },

  quickActionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 },
  cardQuickAction: {
    width: '100%',
    minHeight: 48,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: theme.colors.onPrimary,
    padding: '10px',
    lineHeight: 1.2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardQuickActionFull: { gridColumn: '1 / -1' },
  cardQuickActionCurrent: {
    opacity: 0.45,
    cursor: 'default',
  },

  cardArrowsRow: { display: 'flex', gap: 6 },
  cardArrow: {
    flex: 1,
    backgroundColor: '#9E9E9E',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    color: theme.colors.onPrimary,
    padding: '8px 10px',
    lineHeight: 1,
    textAlign: 'center',
  },
  cardArrowDisabled: {
    opacity: 0.45,
    cursor: 'default',
  },
}
