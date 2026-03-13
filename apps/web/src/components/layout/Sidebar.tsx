import { useState } from 'react'
import { NavLink } from 'react-router'
import { theme } from '@elegante-amaro-app/shared/constants'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Utilisateurs' },
  { to: '/items', label: 'Articles' },
  { to: '/categories', label: 'Catégories' },
  { to: '/item-options', label: 'Options' },
  { to: '/commands', label: 'Commandes' },
  { to: '/tables', label: 'Tables' },
  { to: '/state-commands', label: 'Statuts' },
]

function NavItem({ to, label }: { to: string; label: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <NavLink
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={({ isActive }) => ({
        ...styles.link,
        backgroundColor: isActive
          ? 'rgba(255,255,255,0.13)'
          : hovered
            ? 'rgba(255,255,255,0.07)'
            : 'transparent',
        color: isActive ? theme.colors.onSecondary : 'rgba(232,220,181,0.65)',
      })}
    >
      {label}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <span style={styles.brandTitle}>Elegante</span>
        <span style={styles.brandSub}>Amaro</span>
        <div style={styles.brandDivider} />
        <span style={styles.brandLabel}>Back Office</span>
      </div>

      <nav style={styles.nav}>
        {links.map(({ to, label }) => (
          <NavItem key={to} to={to} label={label} />
        ))}
      </nav>
    </aside>
  )
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 240,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary,
    height: 'calc(100vh - 24px)',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  brand: {
    padding: '28px 20px 22px',
    borderBottom: `1px solid rgba(232,220,181,0.12)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },
  brandTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 26,
    color: theme.colors.onSecondary,
    lineHeight: 1,
  },
  brandSub: {
    fontFamily: theme.fonts.title,
    fontSize: 20,
    color: theme.colors.onSecondary,
    opacity: 0.75,
    lineHeight: 1,
  },
  brandDivider: {
    width: 28,
    height: 1,
    backgroundColor: theme.colors.accent,
    margin: '10px 0 6px',
  },
  brandLabel: {
    fontFamily: theme.fonts.ui,
    fontSize: 9,
    color: theme.colors.onSecondary,
    opacity: 0.45,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 0',
    flex: 1,
    gap: 2,
  },
  link: {
    display: 'block',
    margin: '0 10px',
    padding: '10px 14px',
    fontFamily: theme.fonts.body,
    fontSize: 15,
    textDecoration: 'none',
    borderRadius: 10,
    transition: 'background 0.15s, color 0.15s',
  },
}
