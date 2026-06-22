import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { theme } from '@elegante-amaro-app/shared/constants'
import Button from './Button'

export type SortDirection = 'asc' | 'desc' | null

export interface ColumnFilter {
  options: { value: string | number; label: string }[]
  selected: (string | number)[]
  onChange: (values: (string | number)[]) => void
}

export interface Column<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
  sortable?: boolean
  sortDirection?: SortDirection
  onSortClick?: () => void
  filter?: ColumnFilter
  /** Fixed column width (e.g. '80px', '12%'). Keeps the table layout stable across filtering/sorting/empty states. */
  width?: string | number
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[]
  data: T[]
  onEdit: (row: T) => void
  onDelete?: (row: T) => void
  /** Overall table width. 'half' is for tables with very few columns (e.g. reference lists). Defaults to 'full'. */
  size?: 'full' | 'half'
}

function FilterHeader({ label, filter }: { label: string; filter: ColumnFilter }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const closeOnScroll = () => setOpen(false)

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('scroll', closeOnScroll, true)
    window.addEventListener('resize', closeOnScroll)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('scroll', closeOnScroll, true)
      window.removeEventListener('resize', closeOnScroll)
    }
  }, [open])

  const toggleValue = (value: string | number) => {
    filter.onChange(
      filter.selected.includes(value)
        ? filter.selected.filter(v => v !== value)
        : [...filter.selected, value]
    )
  }

  const handleToggleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + 6, left: rect.left })
    }
    setOpen(o => !o)
  }

  const active = filter.selected.length > 0

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        style={{ ...styles.headerButton, color: active ? theme.colors.accent : theme.colors.muted }}
        onClick={handleToggleOpen}
      >
        {label}
        <span style={styles.filterIcon}>▾</span>
      </button>

      {open && position && createPortal(
        <div ref={panelRef} style={{ ...styles.filterPanel, top: position.top, left: position.left }}>
          {filter.options.map(opt => (
            <label key={opt.value} style={styles.filterOption}>
              <input
                type="checkbox"
                checked={filter.selected.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
                style={styles.checkbox}
              />
              {opt.label}
            </label>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}

function SortHeader({ label, direction, onClick }: { label: string; direction: SortDirection; onClick: () => void }) {
  const arrow = direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'
  return (
    <button
      type="button"
      style={{ ...styles.headerButton, color: direction ? theme.colors.accent : theme.colors.muted }}
      onClick={onClick}
    >
      {label}
      <span style={styles.filterIcon}>{arrow}</span>
    </button>
  )
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
  size = 'full',
}: DataTableProps<T>) {
  return (
    <div style={{ ...styles.wrapper, width: size === 'half' ? '50%' : '100%', margin: size === 'half' ? '0 auto' : 0 }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={`${String(col.key)}-${i}`} style={{ ...styles.th, width: col.width }}>
                {col.filter
                  ? <FilterHeader label={col.label} filter={col.filter} />
                  : col.sortable
                    ? <SortHeader label={col.label} direction={col.sortDirection ?? null} onClick={() => col.onSortClick?.()} />
                    : col.label}
              </th>
            ))}
            <th style={{ ...styles.th, width: onDelete ? 160 : 64, textAlign: 'right' }}>{onDelete ? 'Actions' : ''}</th>
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
                {columns.map((col, i) => (
                  <td key={`${String(col.key)}-${i}`} style={styles.td}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  {onDelete ? (
                    <span style={styles.actions}>
                      <Button variant="ghost" onClick={() => onEdit(row)}>
                        Modifier
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(row)}>
                        Supprimer
                      </Button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-label="Gérer"
                      style={styles.gearButton}
                      onClick={() => onEdit(row)}
                    >
                      ⚙
                    </button>
                  )}
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
    tableLayout: 'fixed',
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
  gearButton: {
    background: 'none',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 15,
    color: theme.colors.onPrimary,
    padding: '6px 10px',
    lineHeight: 1,
  },
  headerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: theme.fonts.ui,
    fontSize: 10,
    fontWeight: 400,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  filterIcon: { fontSize: 9 },
  filterPanel: {
    position: 'fixed',
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 4,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: 160,
    maxHeight: 260,
    overflowY: 'auto',
    padding: 6,
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 8px',
    fontFamily: theme.fonts.body,
    fontSize: 13,
    fontWeight: 400,
    textTransform: 'none',
    letterSpacing: 'normal',
    color: theme.colors.onPrimary,
    cursor: 'pointer',
    borderRadius: 4,
    whiteSpace: 'nowrap',
  },
  checkbox: { cursor: 'pointer' },
}
