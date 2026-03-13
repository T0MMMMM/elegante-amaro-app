import { Outlet } from 'react-router'
import { theme } from '@elegante-amaro-app/shared/constants'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div style={styles.root}>
      <Sidebar />
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#cfc49a',
    padding: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: '40px 48px',
    minHeight: 'calc(100vh - 24px)',
    overflowY: 'auto',
  },
}
