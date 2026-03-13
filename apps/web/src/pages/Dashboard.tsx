import { theme } from '@elegante-amaro-app/shared/constants'

interface BentoCard {
  label: string
  icon: string
  col: string
  row: string
  accent?: boolean
  hero?: boolean
}

const cards: BentoCard[] = [
  { label: 'Commandes',    icon: '📋', col: '1 / 3', row: '2 / 4', accent: true },
  { label: 'Articles',     icon: '☕', col: '3',      row: '2' },
  { label: 'Catégories',   icon: '🏷️', col: '4',      row: '2' },
  { label: 'Options',      icon: '⚙️', col: '3',      row: '3' },
  { label: 'Tables',       icon: '🪑', col: '4',      row: '3' },
  { label: 'Utilisateurs', icon: '👤', col: '1 / 3',  row: '4' },
  { label: 'Statuts',      icon: '🔖', col: '3 / 5',  row: '4' },
]

export default function Dashboard() {
  return (
    <div>
      <div style={styles.grid}>

        {/* Welcome banner */}
        <div style={{ ...styles.card, ...styles.banner, gridColumn: '1 / 5', gridRow: '1' }}>
          <div>
            <span style={styles.bannerTitle}>Elegante Amaro</span>
            <p style={styles.bannerSub}>Bienvenue dans le back office — gérez votre établissement</p>
          </div>
          <div style={styles.bannerDot} />
        </div>

        {/* Entity cards */}
        {cards.map(({ label, icon, col, row, accent }) => (
          <div
            key={label}
            style={{
              ...styles.card,
              ...(accent ? styles.cardAccent : styles.cardDefault),
              gridColumn: col,
              gridRow: row,
            }}
          >
            <span style={accent ? styles.iconAccent : styles.icon}>{icon}</span>
            <div style={styles.cardBody}>
              <span style={{ ...styles.cardLabel, ...(accent ? styles.cardLabelAccent : {}) }}>
                {label}
              </span>
              {/* TODO: fetch count from API */}
              <span style={{ ...styles.cardCount, ...(accent ? styles.cardCountAccent : {}) }}>
                —
              </span>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

const cardBase: React.CSSProperties = {
  borderRadius: 16,
  padding: '22px 24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'hidden',
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: 'minmax(120px, auto)',
    gap: 14,
  },
  card: cardBase,
  banner: {
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 32px',
    minHeight: 90,
  },
  bannerTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 36,
    color: theme.colors.onSecondary,
    display: 'block',
    lineHeight: 1.1,
  },
  bannerSub: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: 'rgba(232,220,181,0.6)',
    marginTop: 4,
  },
  bannerDot: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: theme.colors.accent,
    opacity: 0.5,
    flexShrink: 0,
  },
  cardDefault: {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
  },
  cardAccent: {
    backgroundColor: theme.colors.accent,
    border: 'none',
  },
  icon: {
    fontSize: 26,
  },
  iconAccent: {
    fontSize: 30,
    filter: 'brightness(0) invert(1)',
    opacity: 0.9,
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  cardLabel: {
    fontFamily: theme.fonts.ui,
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: theme.colors.muted,
  },
  cardLabelAccent: {
    color: 'rgba(255,255,255,0.65)',
  },
  cardCount: {
    fontFamily: theme.fonts.body,
    fontSize: 36,
    fontWeight: 700,
    color: theme.colors.onPrimary,
    lineHeight: 1,
  },
  cardCountAccent: {
    color: '#fff',
    fontSize: 48,
  },
}
