import { theme } from '@elegante-amaro-app/shared/constants'

interface Props {
  loading: boolean
  error: string | null
  children: React.ReactNode
}

export default function PageShell({ loading, error, children }: Props) {
  if (loading) return (
    <div style={styles.center}>
      <span style={styles.loadingText}>Chargement…</span>
    </div>
  )
  if (error) return (
    <div style={styles.center}>
      <span style={styles.errorText}>{error}</span>
    </div>
  )
  return <>{children}</>
}

const styles: Record<string, React.CSSProperties> = {
  center: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 80,
  },
  loadingText: {
    fontFamily: theme.fonts.ui,
    fontSize: 13,
    color: theme.colors.muted,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  errorText: {
    fontFamily: theme.fonts.ui,
    fontSize: 13,
    color: theme.colors.danger,
    letterSpacing: '0.05em',
  },
}
