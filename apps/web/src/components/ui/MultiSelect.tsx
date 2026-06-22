import { useEffect, useRef, useState } from 'react'
import { theme } from '@elegante-amaro-app/shared/constants'

interface MultiSelectOption {
  id: number
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
}

export default function MultiSelect({ options, selectedIds, onChange, placeholder = 'Sélectionner…' }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const toggleOption = (id: number) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id])
  }

  const triggerLabel = selectedIds.length === 0
    ? placeholder
    : options.filter(o => selectedIds.includes(o.id)).map(o => o.label).join(', ')

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <button type="button" style={styles.trigger} onClick={() => setOpen(o => !o)}>
        <span style={styles.triggerLabel}>{triggerLabel}</span>
        <span style={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={styles.panel}>
          {options.length === 0 ? (
            <span style={styles.empty}>Aucune option disponible</span>
          ) : (
            options.map(o => (
              <label key={o.id} style={styles.option}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(o.id)}
                  onChange={() => toggleOption(o.id)}
                  style={styles.checkbox}
                />
                {o.label}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { position: 'relative', width: '100%' },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    fontFamily: theme.fonts.body,
    fontSize: 15,
    padding: '9px 12px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    color: theme.colors.onPrimary,
    cursor: 'pointer',
    textAlign: 'left',
  },
  triggerLabel: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 },
  chevron: { fontSize: 10, color: theme.colors.muted, marginLeft: 8 },
  panel: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 4,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    zIndex: 10,
    maxHeight: 220,
    overflowY: 'auto',
    padding: 6,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 8px',
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.onPrimary,
    cursor: 'pointer',
    borderRadius: 4,
  },
  checkbox: { cursor: 'pointer' },
  empty: {
    display: 'block',
    padding: '10px 8px',
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.muted,
  },
}
