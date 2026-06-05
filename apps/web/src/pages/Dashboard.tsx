import { useCallback, useEffect, useState } from 'react'
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
  const [orders, setOrders]   = useState<DashboardOrder[]>([])
  const [states, setStates]   = useState<StateCommand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [now, setNow]         = useState(new Date())

  const load = useCallback(async () => {
    try {
      const [commands, stateCommands, tables, allCmdItems, allItems] = await Promise.all([
        commandsService.getAll(),
        stateCommandsService.getAll(),
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

  // States: last by ID = terminal (served)
  const lastState    = states[states.length - 1]
  const activeStates = states.filter(s => s !== lastState)
  const todayStr     = today()

  const todayOrders  = orders.filter(o => o.createdAt.toDateString() === todayStr)
  const activeOrders = todayOrders.filter(o => o.statusId !== lastState?.id)
  const servedOrders = todayOrders.filter(o => o.statusId === lastState?.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const counts = {
    total:  activeOrders.length,
    ...Object.fromEntries(activeStates.map(s => [
      s.id,
      activeOrders.filter(o => o.statusId === s.id).length,
    ])),
  }

  const ca  = servedOrders.reduce((s, o) => s + Number(o.total), 0)
  const avg = servedOrders.length > 0 ? ca / servedOrders.length : 0
  const fmt = (n: number) =>
    n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'

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
    <div>

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

      {/* ── Active stats ────────────────────────────────────── */}
      <div style={styles.statsRow}>
        <StatBlock value={counts.total} label="Actives" />
        {activeStates.map((s, i) => (
          <>
            <div key={`sep-${s.id}`} style={styles.statSep} />
            <StatBlock
              key={s.id}
              value={(counts as Record<number, number>)[s.id] ?? 0}
              label={s.state}
              dim={i > 0}
            />
          </>
        ))}
      </div>

      {/* ── Active orders ───────────────────────────────────── */}
      {activeOrders.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyTitle}>Tout est à jour</span>
          <span style={styles.emptySub}>Aucune commande active pour le moment</span>
        </div>
      ) : (
        activeStates.map(state => {
          const rows = activeOrders.filter(o => o.statusId === state.id)
          if (rows.length === 0) return null
          const stateIdx = states.findIndex(s => s.id === state.id)
          const nextState = states[stateIdx + 1] ?? null

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

      {/* ── Day stats + history ─────────────────────────────── */}
      <div style={styles.historySeparator} />

      <div style={styles.dayStatsRow}>
        <DayStat value={fmt(ca)}                   label="Chiffre d'affaires" />
        <div style={styles.statSep} />
        <DayStat value={String(todayOrders.length)} label="Commandes du jour"  />
        <div style={styles.statSep} />
        <DayStat value={servedOrders.length > 0 ? fmt(avg) : '—'} label="Ticket moyen" />
        <div style={styles.statSep} />
        <DayStat value={String(servedOrders.length)} label={lastState?.state ?? 'Terminées'} />
      </div>

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
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  center:      { display: 'flex', justifyContent: 'center', paddingTop: 80 },
  loadingText: { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.muted, letterSpacing: '0.1em', textTransform: 'uppercase' },
  errorText:   { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.danger },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 52 },
  greetingText: { fontFamily: theme.fonts.title, fontSize: 72, color: theme.colors.onPrimary, letterSpacing: '0.04em', lineHeight: 1, display: 'block' },
  headerSub:    { display: 'block', fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 500, color: theme.colors.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 12 },
  clockBlock:   { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
  clockTime:    { fontFamily: theme.fonts.title, fontSize: 68, color: theme.colors.onPrimary, letterSpacing: '0.04em', lineHeight: 1 },
  clockDate:    { fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 500, color: theme.colors.muted, letterSpacing: '0.08em', textTransform: 'capitalize' },

  statsRow:  { display: 'flex', alignItems: 'center', paddingBottom: 48, marginBottom: 48, borderBottom: `1px solid rgba(42,31,21,0.08)` },
  statBlock: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  statValue: { fontFamily: theme.fonts.title, fontSize: 80, lineHeight: 1, color: theme.colors.onPrimary, letterSpacing: '0.02em' },
  statLabel: { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.colors.muted },
  statSep:   { width: 1, height: 56, backgroundColor: 'rgba(42,31,21,0.08)' },

  section:       { marginBottom: 44 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 },
  sectionTitle:  { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.colors.muted, whiteSpace: 'nowrap' },
  sectionRule:   { flex: 1, height: 1, backgroundColor: 'rgba(42,31,21,0.08)' },
  sectionCount:  { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600, color: theme.colors.muted, letterSpacing: '0.08em' },

  tableNum: { fontFamily: theme.fonts.title, fontSize: 36, color: theme.colors.onPrimary, letterSpacing: '0.04em', lineHeight: 1, minWidth: 80 },
  items:    { fontFamily: theme.fonts.body, fontSize: 16, fontWeight: 400, color: theme.colors.muted, flex: 1 },
  time:     { fontFamily: theme.fonts.ui, fontSize: 14, letterSpacing: '0.04em', minWidth: 80, textAlign: 'right' },
  total:    { fontFamily: theme.fonts.ui, fontSize: 15, fontWeight: 600, color: theme.colors.onPrimary, letterSpacing: '0.04em', minWidth: 80, textAlign: 'right' },

  historySeparator: { height: 2, backgroundColor: 'rgba(42,31,21,0.07)', margin: '56px 0', borderRadius: 1 },

  dayStatsRow:  { display: 'flex', alignItems: 'center', paddingBottom: 48, marginBottom: 8 },
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
