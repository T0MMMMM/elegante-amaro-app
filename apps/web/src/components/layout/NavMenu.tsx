import { useLocation, useNavigate } from 'react-router'
import { theme } from '@elegante-amaro-app/shared/constants'

export const NAV_WIDTH = 320

const links = [
  { to: '/dashboard',      label: 'Dashboard' },
  { to: '/users',          label: 'Utilisateurs' },
  { to: '/items',          label: 'Articles' },
  { to: '/categories',     label: 'Catégories' },
  { to: '/item-options',   label: 'Options' },
  { to: '/commands',       label: 'Historique' },
  { to: '/tables',         label: 'Tables' },
  { to: '/state-commands', label: 'Statuts' },
]

interface NavMenuProps {
  open: boolean
  onClose: () => void
  onNavigate: (label: string) => void
}

function CloseIcon() {
  const bar: React.CSSProperties = {
    position: 'absolute',
    width: 18,
    height: 1.5,
    backgroundColor: theme.colors.onSecondary,
    borderRadius: 2,
    top: '50%',
    left: '50%',
    transformOrigin: 'center',
  }
  return (
    <div style={{ width: 18, height: 18, position: 'relative' }}>
      <span style={{ ...bar, transform: 'translate(-50%, -50%) rotate(45deg)' }} />
      <span style={{ ...bar, transform: 'translate(-50%, -50%) rotate(-45deg)' }} />
    </div>
  )
}

export default function NavMenu({ open, onClose, onNavigate }: NavMenuProps) {
  const navigate      = useNavigate()
  const { pathname }  = useLocation()

  const handleLink = (to: string, label: string) => {
    if (pathname === to) {
      onClose()
      return
    }
    onNavigate(label)                    // overlay démarre immédiatement
    setTimeout(() => navigate(to), 350)  // navigue quand l'overlay couvre l'écran
    setTimeout(onClose, 1000)            // ferme le menu en fin d'animation
  }

  return (
    <div style={styles.panel}>
      <button
        onClick={onClose}
        style={{
          ...styles.closeBtn,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: `opacity ${open ? '0.3s 0.2s' : '0.15s'}`,
        }}
        aria-label="Fermer le menu"
      >
        <CloseIcon />
      </button>

      <div style={styles.brand}>
        <span style={styles.brandTitle}>Elegante</span>
        <span style={styles.brandSub}>Amaro</span>
        <div style={styles.divider} />
        <span style={styles.backOffice}>Back Office</span>
      </div>

      <nav style={styles.nav}>
        {links.map(({ to, label }, i) => {
          const isActive = pathname === to
          return (
            <div
              key={to}
              role="link"
              tabIndex={0}
              onClick={() => handleLink(to, label)}
              onKeyDown={e => e.key === 'Enter' && handleLink(to, label)}
              style={{
                fontFamily: theme.fonts.title,
                fontSize: 38,
                letterSpacing: '0.04em',
                lineHeight: 1.45,
                cursor: 'pointer',
                userSelect: 'none',
                color: isActive ? theme.colors.accent : theme.colors.onSecondary,
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0)' : 'translateX(24px)',
                transition: [
                  'color 0.15s',
                  `opacity ${open ? `0.45s ${0.1 + i * 0.055}s` : '0.18s'}`,
                  `transform ${open ? `0.5s ${0.1 + i * 0.055}s` : '0.18s'} cubic-bezier(0.76, 0, 0.24, 1)`,
                ].join(', '),
              }}
            >
              {label}
            </div>
          )
        })}
      </nav>

      <div
        style={{
          ...styles.footer,
          opacity: open ? 1 : 0,
          transition: `opacity ${open ? '0.4s 0.6s' : '0.15s'}`,
        }}
      >
        <div style={styles.footerLine} />
        <span style={styles.footerText}>elegante-amaro.fr</span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'fixed',
    right: 0,
    top: 0,
    width: NAV_WIDTH,
    height: '100vh',
    backgroundColor: theme.colors.secondary,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    padding: '36px 32px 32px',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    marginBottom: 44,
  },
  brandTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 28,
    color: theme.colors.onSecondary,
    letterSpacing: '0.04em',
    lineHeight: 1,
  },
  brandSub: {
    fontFamily: theme.fonts.title,
    fontSize: 22,
    color: theme.colors.accent,
    letterSpacing: '0.04em',
    lineHeight: 1,
  },
  divider: {
    width: 24,
    height: 2,
    backgroundColor: theme.colors.accent,
    margin: '12px 0 8px',
    borderRadius: 1,
  },
  backOffice: {
    fontFamily: theme.fonts.ui,
    fontSize: 9,
    fontWeight: 500 as const,
    color: theme.colors.onSecondary,
    opacity: 0.35,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.16em',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    paddingTop: 20,
  },
  footerLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,250,237,0.08)',
    marginBottom: 14,
  },
  footerText: {
    fontFamily: theme.fonts.ui,
    fontSize: 10,
    fontWeight: 400 as const,
    color: theme.colors.onSecondary,
    opacity: 0.25,
    letterSpacing: '0.08em',
  },
}
