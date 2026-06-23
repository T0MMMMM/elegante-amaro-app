import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { theme } from '@elegante-amaro-app/shared/constants'
import { commandsService }     from '../services/commands.service'
import { commandItemsService } from '../services/commandItems.service'
import { stateCommandsService } from '../services/stateCommands.service'
import { tablesService }        from '../services/tables.service'
import { itemsService }         from '../services/items.service'
import type { StateCommand }    from '@elegante-amaro-app/shared/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardOrder {
  id: number
  table: number
  statusId: number
  statusName: string
  items: string[]
  createdAt: Date
  total: number
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function elapsed(createdAt: Date, now: Date) {
  return Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / 60_000))
}

function greeting(h: number) {
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bonne après-midi'
  return 'Bonsoir'
}

function servedAt(createdAt: Date) {
  return createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const today = () => new Date().toDateString()

// ─── Stat blocks ─────────────────────────────────────────────────────────────

function StatBlock({ value, label, dim }: { value: number; label: string; dim?: boolean }) {
  return (
    <div style={styles.statBlock}>
      <span style={{ ...styles.statValue, opacity: dim && value === 0 ? 0.22 : 1 }}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  )
}

function DayStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={styles.dayStatBlock}>
      <span style={styles.dayStatValue}>{value}</span>
      <span style={styles.dayStatLabel}>{label}</span>
    </div>
  )
}

function ActionBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        padding: '40px 0',
        fontFamily: theme.fonts.ui,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        border: 'none',
        borderRadius: 0,
        cursor: 'pointer',
        transition: 'background 0.15s, opacity 0.15s',
        backgroundColor: hov ? theme.colors.secondary : theme.colors.accent,
        color: theme.colors.onSecondary,
        opacity: hov ? 0.88 : 1,
      }}
    >
      {label}
    </button>
  )
}

// ─── Active order row ─────────────────────────────────────────────────────────

function OrderRow({
  order, now, nextState, onAdvance,
}: {
  order: DashboardOrder
  now: Date
  nextState: StateCommand | null
  onAdvance: (id: number, nextStateId: number) => void
}) {
  const [hov, setHov]       = useState(false)
  const [btnHov, setBtnHov] = useState(false)
  const [saving, setSaving] = useState(false)

  const min       = elapsed(order.createdAt, now)
  const isLate    = min >= 15
  const isWarning = min >= 8
  const isReady   = !nextState

  const timeColor = isLate    ? theme.colors.onPrimary
                  : isWarning ? theme.colors.accent
                  :             theme.colors.muted

  const borderColor = isReady ? theme.colors.onPrimary
                    : isLate  ? theme.colors.accent
                    :           'transparent'

  const handleAdvance = async () => {
    if (!nextState || saving) return
    setSaving(true)
    try { await onAdvance(order.id, nextState.id) } finally { setSaving(false) }
  }

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '20px 0 20px 14px',
        borderBottom: `1px solid rgba(42,31,21,0.06)`,
        borderLeft: `3px solid ${borderColor}`,
        backgroundColor: hov ? 'rgba(191,157,123,0.05)' : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span style={styles.tableNum}>T.{String(order.table).padStart(2, '0')}</span>
      <span style={styles.items}>
        {order.items.length > 0 ? order.items.join(' · ') : <em>Aucun article</em>}
      </span>
      <span style={{ ...styles.time, color: timeColor, fontWeight: isLate ? 600 : 400 }}>
        {min === 0 ? "À l'instant" : `${min} min`}
      </span>
      <span style={styles.total}>{Number(order.total).toFixed(2)} €</span>
      {nextState && (
        <button
          onClick={handleAdvance}
          disabled={saving}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '10px 20px', borderRadius: 3, cursor: saving ? 'wait' : 'pointer',
            whiteSpace: 'nowrap', transition: 'background 0.15s, color 0.15s',
            opacity: saving ? 0.6 : 1,
            border: `1.5px solid ${theme.colors.accent}`,
            backgroundColor: btnHov && !saving ? theme.colors.accent : 'transparent',
            color: btnHov && !saving ? theme.colors.primary : theme.colors.accent,
          }}
        >
          {saving ? '…' : nextState.state}
        </button>
      )}
    </div>
  )
}

// ─── History row ──────────────────────────────────────────────────────────────

function HistoryRow({ order }: { order: DashboardOrder }) {
  return (
    <div style={styles.historyRow}>
      <span style={styles.historyTime}>{servedAt(order.createdAt)}</span>
      <span style={styles.historyTable}>T.{String(order.table).padStart(2, '0')}</span>
      <span style={styles.historyItems}>
        {order.items.length > 0 ? order.items.join(' · ') : '—'}
      </span>
      <span style={styles.historyTotal}>{Number(order.total).toFixed(2)} €</span>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [orders, setOrders]   = useState<DashboardOrder[]>([])
  const [states, setStates]   = useState<StateCommand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [now, setNow]         = useState(new Date())

  const load = useCallback(async () => {
    try {
      const [commands, stateCommands, tables, allCmdItems, allItems] = await Promise.all([
        commandsService.getAll(),
        stateCommandsService.getAll(true),
        tablesService.getAll(),
        commandItemsService.getAll(),
        itemsService.getAll(),
      ])

      const sorted = [...stateCommands].sort((a, b) => a.id - b.id)
      setStates(sorted)

      const enriched: DashboardOrder[] = commands.map(cmd => {
        const state    = stateCommands.find(s => s.id === cmd.state_command_id)
        const table    = tables.find(t => t.id === cmd.table_id)
        const cmdItems = allCmdItems.filter(ci => ci.command_id === cmd.id)
        const labels   = cmdItems.map(ci => {
          const item = allItems.find(i => i.id === ci.item_id)
          return ci.quantity > 1 ? `${item?.name ?? '?'} × ${ci.quantity}` : (item?.name ?? '?')
        })
        return {
          id: cmd.id,
          table: table?.numero ?? cmd.table_id,
          statusId: cmd.state_command_id,
          statusName: state?.state ?? `Statut #${cmd.state_command_id}`,
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

  // Tick clock + refresh orders every 60 s
  useEffect(() => {
    load()
    const tick = setInterval(() => {
      setNow(new Date())
      load()
    }, 60_000)
    return () => clearInterval(tick)
  }, [load])

  const advance = async (orderId: number, nextStateId: number) => {
    await commandsService.update(orderId, { state_command_id: nextStateId })
    const nextState = states.find(s => s.id === nextStateId)
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? { ...o, statusId: nextStateId, statusName: nextState?.state ?? '' }
        : o
    ))
  }

  const TERMINAL = ['livrée', 'annulée']

  const todayStr     = today()
  const todayOrders  = orders.filter(o => o.createdAt.toDateString() === todayStr)
  const activeOrders = todayOrders.filter(o => {
    const stateName = states.find(s => s.id === o.statusId)?.state ?? ''
    return !TERMINAL.includes(stateName)
  })
  const servedOrders = todayOrders.filter(o => {
    const stateName = states.find(s => s.id === o.statusId)?.state ?? ''
    return stateName === 'livrée'
  })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const countActive  = activeOrders.length
  const countPending = activeOrders.filter(o => states.find(s => s.id === o.statusId)?.state === 'en attente').length
  const countReady   = activeOrders.filter(o => states.find(s => s.id === o.statusId)?.state === 'prête').length
  const ca           = servedOrders.reduce((s, o) => s + Number(o.total), 0)
  const fmt          = (n: number) =>
    n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'

  const displayStates = states.filter(s => !TERMINAL.includes(s.state) && !s.deleted_at)

  if (loading) return (
    <div style={styles.center}>
      <span style={styles.loadingText}>Chargement des commandes…</span>
    </div>
  )

  if (error) return (
    <div style={styles.center}>
      <span style={styles.errorText}>{error}</span>
    </div>
  )

  return (
    <div style={styles.root}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={styles.header}>
        <div>
          <span style={styles.greetingText}>{greeting(now.getHours())}</span>
          <span style={styles.headerSub}>Commandes en cours · Service du jour</span>
        </div>
        <div style={styles.clockBlock}>
          <span style={styles.clockTime}>
            {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span style={styles.clockDate}>
            {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </div>

      {/* ── Top action bar — full width, glued, flush to edges ── */}
      <div style={styles.actionsRow}>
        <ActionBtn label="Créer une commande" onClick={() => navigate('/new-command')} />
        <div style={styles.btnDivider} />
        <ActionBtn label="Historique des commandes" onClick={() => navigate('/commands')} />
      </div>

      {/* ── Scrollable orders ───────────────────────────────── */}
      <div style={styles.scrollArea}>
        {activeOrders.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyTitle}>Tout est à jour</span>
            <span style={styles.emptySub}>Aucune commande active pour le moment</span>
          </div>
        ) : (
          displayStates.map(state => {
            const rows = activeOrders.filter(o => o.statusId === state.id)
            if (rows.length === 0) return null
            const stateIdx = displayStates.findIndex(s => s.id === state.id)
            const nextState = displayStates[stateIdx + 1]
              ?? states.find(s => s.state === 'livrée')
              ?? null

            return (
              <div key={state.id} style={styles.section}>
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionTitle}>{state.state}</span>
                  <div style={styles.sectionRule} />
                  <span style={styles.sectionCount}>{rows.length}</span>
                </div>
                {rows.map(order => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    now={now}
                    nextState={nextState}
                    onAdvance={advance}
                  />
                ))}
              </div>
            )
          })
        )}

        {servedOrders.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Historique du jour</span>
              <div style={styles.sectionRule} />
              <span style={styles.sectionCount}>{servedOrders.length}</span>
            </div>
            {servedOrders.map(order => (
              <HistoryRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* ── Stats — moved to bottom ─────────────────────────── */}
      <div style={styles.statsRowBottom}>
        <StatBlock value={countActive}  label="Actives" />
        <div style={styles.statSep} />
        <StatBlock value={countPending} label="En attente" dim />
        <div style={styles.statSep} />
        <DayStat value={fmt(ca)}        label="CA du jour" />
        <div style={styles.statSep} />
        <StatBlock value={countReady}   label="Prêtes" dim />
      </div>

    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  center:      { display: 'flex', justifyContent: 'center', paddingTop: 80 },
  loadingText: { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.muted, letterSpacing: '0.1em', textTransform: 'uppercase' },
  errorText:   { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.danger },

  root:   { height: '100%', display: 'flex', flexDirection: 'column' },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexShrink: 0 },
  greetingText: { fontFamily: theme.fonts.title, fontSize: 44, color: theme.colors.onPrimary, letterSpacing: '0.04em', lineHeight: 1, display: 'block' },
  headerSub:    { display: 'block', fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 500, color: theme.colors.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 10 },
  clockBlock:   { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  clockTime:    { fontFamily: theme.fonts.title, fontSize: 42, color: theme.colors.onPrimary, letterSpacing: '0.04em', lineHeight: 1 },
  clockDate:    { fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 500, color: theme.colors.muted, letterSpacing: '0.08em', textTransform: 'capitalize' },

  statBlock: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  statValue: { fontFamily: theme.fonts.title, fontSize: 80, lineHeight: 1, color: theme.colors.onPrimary, letterSpacing: '0.02em' },
  statLabel: { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.colors.muted },
  statSep:   { width: 1, height: 72, backgroundColor: 'rgba(42,31,21,0.08)' },

  section:       { marginBottom: 44 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 },
  sectionTitle:  { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.colors.muted, whiteSpace: 'nowrap' },
  sectionRule:   { flex: 1, height: 1, backgroundColor: 'rgba(42,31,21,0.08)' },
  sectionCount:  { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600, color: theme.colors.muted, letterSpacing: '0.08em' },

  tableNum: { fontFamily: theme.fonts.title, fontSize: 36, color: theme.colors.onPrimary, letterSpacing: '0.04em', lineHeight: 1, minWidth: 80 },
  items:    { fontFamily: theme.fonts.body, fontSize: 16, fontWeight: 400, color: theme.colors.muted, flex: 1 },
  time:     { fontFamily: theme.fonts.ui, fontSize: 14, letterSpacing: '0.04em', minWidth: 80, textAlign: 'right' },
  total:    { fontFamily: theme.fonts.ui, fontSize: 15, fontWeight: 600, color: theme.colors.onPrimary, letterSpacing: '0.04em', minWidth: 80, textAlign: 'right' },

  // Top action bar: full width, flush to the content edges (escapes the
  // main padding of 56px left / 96px right), the two buttons glued together.
  actionsRow: { display: 'flex', gap: 0, marginLeft: -56, marginRight: -96, marginBottom: 28, flexShrink: 0 },
  btnDivider: { width: 1, backgroundColor: 'rgba(255,250,237,0.18)', flexShrink: 0 },

  // Orders fill the remaining height and scroll on their own → no page scroll.
  scrollArea: { flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 8 },

  // Stats pinned at the bottom of the page.
  statsRowBottom: { display: 'flex', alignItems: 'center', paddingTop: 28, marginTop: 24, borderTop: `1px solid rgba(42,31,21,0.08)`, flexShrink: 0 },

  dayStatBlock: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  dayStatValue: { fontFamily: theme.fonts.title, fontSize: 48, lineHeight: 1, color: theme.colors.onPrimary, letterSpacing: '0.03em' },
  dayStatLabel: { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.colors.muted },

  historyRow:    { display: 'flex', alignItems: 'center', gap: 20, padding: '16px 0 16px 14px', borderBottom: `1px solid rgba(42,31,21,0.04)`, borderLeft: '3px solid transparent', opacity: 0.6 },
  historyTime:   { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.muted, letterSpacing: '0.04em', minWidth: 44 },
  historyTable:  { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.onPrimary, letterSpacing: '0.04em', lineHeight: 1, minWidth: 80 },
  historyItems:  { fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.muted, flex: 1 },
  historyTotal:  { fontFamily: theme.fonts.ui, fontSize: 14, fontWeight: 600, color: theme.colors.onPrimary, minWidth: 80, textAlign: 'right' },

  empty:     { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, gap: 14 },
  emptyTitle: { fontFamily: theme.fonts.title, fontSize: 68, color: theme.colors.accent, letterSpacing: '0.06em' },
  emptySub:   { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.muted, letterSpacing: '0.1em', textTransform: 'uppercase' },
}
