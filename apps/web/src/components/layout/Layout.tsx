import { useCallback, useState } from 'react'
import { Outlet } from 'react-router'
import { theme } from '@elegante-amaro-app/shared/constants'
import NavMenu, { NAV_WIDTH } from './NavMenu'

function HamburgerLines() {
  return (
    <div style={{ width: 22, height: 14, position: 'relative' }}>
      {([0, 6, 14] as number[]).map((top, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top,
            width: i === 1 ? '70%' : '100%',
            height: 1.5,
            backgroundColor: theme.colors.accent,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [wipe, setWipe]         = useState<{ label: string; rev: number } | null>(null)

  const triggerWipe = useCallback((label: string) => {
    setWipe(w => ({ label, rev: (w?.rev ?? 0) + 1 }))
  }, [])

  return (
    <div style={styles.root}>
      <NavMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={triggerWipe}
      />

      <div
        style={{
          ...styles.contentWrapper,
          transform: menuOpen
            ? `translateX(-${NAV_WIDTH}px) scale(0.97)`
            : 'translateX(0) scale(1)',
          borderRadius: menuOpen ? 24 : 0,
          boxShadow: menuOpen
            ? '-24px 0 80px rgba(0,0,0,0.5), 0 24px 60px rgba(0,0,0,0.3)'
            : 'none',
        }}
      >
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            ...styles.hamburger,
            opacity: menuOpen ? 0 : 1,
            pointerEvents: menuOpen ? 'none' : 'auto',
          }}
          aria-label="Ouvrir le menu"
        >
          <HamburgerLines />
        </button>

        {menuOpen && (
          <div style={styles.scrim} onClick={() => setMenuOpen(false)} />
        )}

        {wipe && (
          <div key={wipe.rev} className="page-wipe" style={styles.wipeOverlay}>
            <span style={styles.wipeLabel}>{wipe.label}</span>
            <div style={styles.wipeLine} />
          </div>
        )}

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: theme.colors.secondary,
    position: 'relative',
  },
  contentWrapper: {
    position: 'relative',
    height: '100vh',
    backgroundColor: theme.colors.primary,
    zIndex: 20,
    transformOrigin: 'left center',
    transition: [
      'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)',
      'border-radius 0.65s ease',
      'box-shadow 0.65s ease',
    ].join(', '),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  hamburger: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 40,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.25s',
  },
  scrim: {
    position: 'absolute',
    inset: 0,
    zIndex: 30,
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '48px 96px 48px 56px',
  },
  wipeOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    backgroundColor: theme.colors.primary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    pointerEvents: 'none',
  },
  wipeLabel: {
    fontFamily: theme.fonts.title,
    fontSize: 96,
    color: theme.colors.onPrimary,
    letterSpacing: '0.06em',
    lineHeight: 1,
  },
  wipeLine: {
    width: 48,
    height: 2,
    backgroundColor: theme.colors.accent,
    borderRadius: 1,
    opacity: 0.5,
  },
}
