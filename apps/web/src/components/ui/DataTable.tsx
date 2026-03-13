import { theme } from '@elegante-amaro-app/shared/constants'
import Button from './Button'

export interface Column<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[]
  data: T[]
  onEdit: (row: T) => void
  onDelete: (row: T) => void
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={styles.th}>
                {col.label}
              </th>
            ))}
            <th style={{ ...styles.th, width: 120, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={styles.empty}>
                Aucune donnée
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} style={styles.tr}>
                {columns.map((col) => (
                  <td key={String(col.key)} style={styles.td}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <span style={styles.actions}>
                    <Button variant="ghost" onClick={() => onEdit(row)}>
                      Modifier
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(row)}>
                      Supprimer
                    </Button>
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    overflowX: 'auto',
    borderRadius: 8,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: theme.fonts.body,
    fontSize: 15,
  },
  th: {
    padding: '12px 16px',
    fontFamily: theme.fonts.ui,
    fontSize: 10,
    fontWeight: 400,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: theme.colors.muted,
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.primary,
  },
  tr: {
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  td: {
    padding: '12px 16px',
    color: theme.colors.onPrimary,
    verticalAlign: 'middle',
  },
  empty: {
    padding: '32px 16px',
    textAlign: 'center',
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 15,
  },
  actions: {
    display: 'inline-flex',
    gap: 8,
  },
}
