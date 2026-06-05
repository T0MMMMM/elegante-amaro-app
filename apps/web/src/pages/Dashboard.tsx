import { useEffect, useState } from 'react'
import { theme } from '@elegante-amaro-app/shared/constants'

type OrderStatus = 'En attente' | 'En préparation' | 'Prêt' | 'Servi'

interface MockOrder {
  id: number
  table: number
  status: OrderStatus
  items: string[]
  minutesAgo: number
  total: number
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  'En attente': 'En préparation',
  'En préparation': 'Prêt',
  'Prêt': 'Servi',
}
const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  'En attente': 'Préparer',
  'En préparation': 'Marquer prêt',
  'Prêt': 'Servir',
}
const ACTIVE_STATUSES: OrderStatus[] = ['En attente', 'En préparation', 'Prêt']

const INITIAL_ORDERS: MockOrder[] = [
  // — Actives —
  { id: 1,  table: 3,  status: 'En attente',     items: ['Café allongé', 'Expresso', 'Croissant amande'], minutesAgo: 3,   total: 14.50 },
  { id: 2,  table: 7,  status: 'En attente',     items: ['Thé vert', 'Madeleine × 2'],                   minutesAgo: 9,   total: 9.00  },
  { id: 3,  table: 2,  status: 'En attente',     items: ['Latte', 'Tiramisu'],                            minutesAgo: 14,  total: 13.00 },
  { id: 4,  table: 12, status: 'En attente',     items: ['Chocolat chaud'],                               minutesAgo: 22,  total: 5.50  },
  { id: 5,  table: 5,  status: 'En préparation', items: ['Americano × 2', 'Financier'],                  minutesAgo: 4,   total: 11.00 },
  { id: 6,  table: 1,  status: 'En préparation', items: ['Cappuccino', 'Pain au chocolat'],               minutesAgo: 7,   total: 10.50 },
  { id: 7,  table: 9,  status: 'En préparation', items: ['Chocolat chaud × 3', 'Tarte citron'],          minutesAgo: 11,  total: 22.00 },
  { id: 8,  table: 4,  status: 'Prêt',           items: ['Noisette', 'Cookie'],                          minutesAgo: 15,  total: 7.50  },
  { id: 9,  table: 6,  status: 'Prêt',           items: ['Thé Earl Grey', 'Éclair chocolat'],            minutesAgo: 18,  total: 9.50  },
  { id: 10, table: 11, status: 'Prêt',           items: ['Cappuccino × 2', 'Viennoiserie'],              minutesAgo: 23,  total: 16.00 },
  // — Historique du jour —
  { id: 11, table: 8,  status: 'Servi',          items: ['Expresso × 2'],                                minutesAgo: 31,  total: 6.00  },
  { id: 12, table: 3,  status: 'Servi',          items: ['Latte', 'Croissant beurre'],                   minutesAgo: 44,  total: 11.50 },
  { id: 13, table: 10, status: 'Servi',          items: ['Thé vert', 'Tarte aux pommes'],                minutesAgo: 58,  total: 12.00 },
  { id: 14, table: 2,  status: 'Servi',          items: ['Cappuccino × 3'],                              minutesAgo: 72,  total: 13.50 },
  { id: 15, table: 6,  status: 'Servi',          items: ['Chocolat chaud', 'Cookie × 2'],                minutesAgo: 89,  total: 9.00  },
  { id: 16, table: 5,  status: 'Servi',          items: ['Café crème', 'Madeleine'],                     minutesAgo: 103, total: 8.50  },
  { id: 17, table: 13, status: 'Servi',          items: ['Americano', 'Pain au raisin'],                 minutesAgo: 118, total: 7.50  },
  { id: 18, table: 1,  status: 'Servi',          items: ['Thé Earl Grey × 2', 'Financier × 2'],         minutesAgo: 135, total: 15.00 },
]

function greeting(h: number) {
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bonne après-midi'
  return 'Bonsoir'
}

function servedTime(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000)
    .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// ─── Stat block (active operations) ────────────────────────────────────────

function StatBlock({ value, label, dim }: { value: number; label: string; dim?: boolean }) {
  return (
    <div style={styles.statBlock}>
      <span style={{ ...styles.statValue, opacity: dim && value === 0 ? 0.22 : 1 }}>
        {value}
      </span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  )
}

// ─── Stat block (day summary) ───────────────────────────────────────────────

function DayStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={styles.dayStatBlock}>
      <span style={styles.dayStatValue}>{value}</span>
      <span style={styles.dayStatLabel}>{label}</span>
    </div>
  )
}

// ─── Active order row ───────────────────────────────────────────────────────

function OrderRow({ order, onAdvance }: { order: MockOrder; onAdvance: (id: number) => void }) {
  const [hov, setHov] = useState(false)
  const [btnHov, setBtnHov] = useState(false)

  const isLate    = order.minutesAgo >= 15
  const isWarning = order.minutesAgo >= 8
  const isReady   = order.status === 'Prêt'

  const timeColor = isLate    ? theme.colors.onPrimary
                  : isWarning ? theme.colors.accent
                  :             theme.colors.muted

  const borderColor = isReady ? theme.colors.onPrimary
                    : isLate  ? theme.colors.accent
                    :           'transparent'

  const nextLabel = ACTION_LABEL[order.status]

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
      <span style={styles.items}>{order.items.join(' · ')}</span>
      <span style={{ ...styles.time, color: timeColor, fontWeight: isLate ? 600 : 400 }}>
        {order.minutesAgo === 0 ? "À l'instant" : `${order.minutesAgo} min`}
      </span>
      <span style={styles.total}>{order.total.toFixed(2)} €</span>
      {nextLabel && (
        <button
          onClick={() => onAdvance(order.id)}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '10px 20px', borderRadius: 3, cursor: 'pointer',
            whiteSpace: 'nowrap', transition: 'background 0.15s, color 0.15s',
            ...(isReady ? {
              border: `1.5px solid ${theme.colors.onPrimary}`,
              backgroundColor: theme.colors.onPrimary,
              color: theme.colors.primary,
            } : {
              border: `1.5px solid ${theme.colors.accent}`,
              backgroundColor: btnHov ? theme.colors.accent : 'transparent',
              color: btnHov ? theme.colors.primary : theme.colors.accent,
            }),
          }}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}

// ─── History row ─────────────────────────────────────────────────────────────

function HistoryRow({ order }: { order: MockOrder }) {
  return (
    <div style={styles.historyRow}>
      <span style={styles.historyTime}>{servedTime(order.minutesAgo)}</span>
      <span style={styles.historyTable}>T.{String(order.table).padStart(2, '0')}</span>
      <span style={styles.historyItems}>{order.items.join(' · ')}</span>
      <span style={styles.historyTotal}>{order.total.toFixed(2)} €</span>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [orders, setOrders] = useState<MockOrder[]>(INITIAL_ORDERS)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  const advance = (id: number) => {
    setOrders(prev => prev.map(o =>
      o.id === id && NEXT_STATUS[o.status]
        ? { ...o, status: NEXT_STATUS[o.status]!, minutesAgo: 0 }
        : o
    ))
  }

  const active  = orders.filter(o => ACTIVE_STATUSES.includes(o.status))
  const served  = orders.filter(o => o.status === 'Servi')
    .sort((a, b) => a.minutesAgo - b.minutesAgo)

  const counts = {
    total:       active.length,
    attente:     orders.filter(o => o.status === 'En attente').length,
    preparation: orders.filter(o => o.status === 'En préparation').length,
    pret:        orders.filter(o => o.status === 'Prêt').length,
  }

  const ca      = served.reduce((s, o) => s + o.total, 0)
  const avg     = served.length > 0 ? ca / served.length : 0
  const totalCmds = orders.length

  const fmt = (n: number) =>
    n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'

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
        <StatBlock value={counts.total}       label="Actives"        />
        <div style={styles.statSep} />
        <StatBlock value={counts.attente}     label="En attente"  dim />
        <div style={styles.statSep} />
        <StatBlock value={counts.preparation} label="En préparation" dim />
        <div style={styles.statSep} />
        <StatBlock value={counts.pret}        label="Prêtes"      dim />
      </div>

      {/* ── Active orders ───────────────────────────────────── */}
      {active.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyTitle}>Tout est à jour</span>
          <span style={styles.emptySub}>Aucune commande active pour le moment</span>
        </div>
      ) : (
        ACTIVE_STATUSES.map(status => {
          const rows = orders.filter(o => o.status === status)
          if (rows.length === 0) return null
          return (
            <div key={status} style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>{status}</span>
                <div style={styles.sectionRule} />
                <span style={styles.sectionCount}>{rows.length}</span>
              </div>
              {rows.map(order => (
                <OrderRow key={order.id} order={order} onAdvance={advance} />
              ))}
            </div>
          )
        })
      )}

      {/* ── Day stats + history ─────────────────────────────── */}
      <div style={styles.historySeparator} />

      <div style={styles.dayStatsRow}>
        <DayStat value={fmt(ca)}          label="Chiffre d'affaires" />
        <div style={styles.statSep} />
        <DayStat value={String(totalCmds)} label="Commandes du jour"  />
        <div style={styles.statSep} />
        <DayStat value={served.length > 0 ? fmt(avg) : '—'} label="Ticket moyen" />
        <div style={styles.statSep} />
        <DayStat value={String(served.length)} label="Servies"        />
      </div>

      {served.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Historique du jour</span>
            <div style={styles.sectionRule} />
            <span style={styles.sectionCount}>{served.length}</span>
          </div>
          {served.map(order => (
            <HistoryRow key={order.id} order={order} />
          ))}
        </div>
      )}

    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 52,
  },
  greetingText: {
    fontFamily: theme.fonts.title, fontSize: 72, color: theme.colors.onPrimary,
    letterSpacing: '0.04em', lineHeight: 1, display: 'block',
  },
  headerSub: {
    display: 'block', fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 500,
    color: theme.colors.muted, letterSpacing: '0.12em',
    textTransform: 'uppercase', marginTop: 12,
  },
  clockBlock: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
  },
  clockTime: {
    fontFamily: theme.fonts.title, fontSize: 68, color: theme.colors.onPrimary,
    letterSpacing: '0.04em', lineHeight: 1,
  },
  clockDate: {
    fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 500,
    color: theme.colors.muted, letterSpacing: '0.08em', textTransform: 'capitalize',
  },

  // Active stats
  statsRow: {
    display: 'flex', alignItems: 'center',
    paddingBottom: 48, marginBottom: 48,
    borderBottom: `1px solid rgba(42,31,21,0.08)`,
  },
  statBlock: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  },
  statValue: {
    fontFamily: theme.fonts.title, fontSize: 80, lineHeight: 1,
    color: theme.colors.onPrimary, letterSpacing: '0.02em',
  },
  statLabel: {
    fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600,
    letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.colors.muted,
  },
  statSep: {
    width: 1, height: 56, backgroundColor: 'rgba(42,31,21,0.08)',
  },

  // Section headers
  section: { marginBottom: 44 },
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 700,
    letterSpacing: '0.18em', textTransform: 'uppercase',
    color: theme.colors.muted, whiteSpace: 'nowrap',
  },
  sectionRule: {
    flex: 1, height: 1, backgroundColor: 'rgba(42,31,21,0.08)',
  },
  sectionCount: {
    fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600,
    color: theme.colors.muted, letterSpacing: '0.08em',
  },

  // Active order row
  tableNum: {
    fontFamily: theme.fonts.title, fontSize: 36, color: theme.colors.onPrimary,
    letterSpacing: '0.04em', lineHeight: 1, minWidth: 80,
  },
  items: {
    fontFamily: theme.fonts.body, fontSize: 16, fontWeight: 400,
    color: theme.colors.muted, flex: 1,
  },
  time: {
    fontFamily: theme.fonts.ui, fontSize: 14,
    letterSpacing: '0.04em', minWidth: 80, textAlign: 'right',
  },
  total: {
    fontFamily: theme.fonts.ui, fontSize: 15, fontWeight: 600,
    color: theme.colors.onPrimary, letterSpacing: '0.04em',
    minWidth: 80, textAlign: 'right',
  },

  // Separator between operations and history
  historySeparator: {
    height: 2,
    backgroundColor: 'rgba(42,31,21,0.07)',
    margin: '56px 0',
    borderRadius: 1,
  },

  // Day stats
  dayStatsRow: {
    display: 'flex', alignItems: 'center',
    paddingBottom: 48, marginBottom: 8,
  },
  dayStatBlock: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  },
  dayStatValue: {
    fontFamily: theme.fonts.title, fontSize: 48, lineHeight: 1,
    color: theme.colors.onPrimary, letterSpacing: '0.03em',
  },
  dayStatLabel: {
    fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600,
    letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.colors.muted,
  },

  // History row
  historyRow: {
    display: 'flex', alignItems: 'center', gap: 20,
    padding: '16px 0 16px 14px',
    borderBottom: `1px solid rgba(42,31,21,0.04)`,
    borderLeft: '3px solid transparent',
    opacity: 0.6,
  },
  historyTime: {
    fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.muted,
    letterSpacing: '0.04em', minWidth: 44,
  },
  historyTable: {
    fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.onPrimary,
    letterSpacing: '0.04em', lineHeight: 1, minWidth: 80,
  },
  historyItems: {
    fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.muted, flex: 1,
  },
  historyTotal: {
    fontFamily: theme.fonts.ui, fontSize: 14, fontWeight: 600,
    color: theme.colors.onPrimary, minWidth: 80, textAlign: 'right',
  },

  // Empty state
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: 80, gap: 14,
  },
  emptyTitle: {
    fontFamily: theme.fonts.title, fontSize: 68,
    color: theme.colors.accent, letterSpacing: '0.06em',
  },
  emptySub: {
    fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.muted,
    letterSpacing: '0.1em', textTransform: 'uppercase',
  },
}
