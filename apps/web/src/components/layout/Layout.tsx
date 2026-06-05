import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
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
  const { pathname } = useLocation()

  return (
    <div style={styles.root}>
      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main content — slides left and scales down to reveal the dark background */}
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
        {/* Hamburger — only visible when menu is closed */}
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

        {/* Scrim — clicking the shifted content closes the menu */}
        {menuOpen && (
          <div style={styles.scrim} onClick={() => setMenuOpen(false)} />
        )}

        <main key={pathname} className="page-in" style={styles.content}>
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
}
