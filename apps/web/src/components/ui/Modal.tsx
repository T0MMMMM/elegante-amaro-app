import { ReactNode } from 'react'
import { theme } from '@elegante-amaro-app/shared/constants'
import Button from './Button'

interface ModalProps {
  title: string
  onClose: () => void
  onSubmit: () => void
  children: ReactNode
}

export default function Modal({ title, onClose, onSubmit, children }: ModalProps) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button style={styles.close} onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <div style={styles.body}>{children}</div>

        <div style={styles.footer}>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={fieldStyles.group}>
      <label style={fieldStyles.label}>{label}</label>
      {children}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input style={fieldStyles.input} {...props} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select style={fieldStyles.input} {...props} />
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(33,33,33,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    width: '100%',
    maxWidth: 520,
    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px 16px',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  title: {
    fontFamily: theme.fonts.body,
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.onPrimary,
  },
  close: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    color: theme.colors.muted,
    padding: 4,
  },
  body: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    padding: '16px 24px 20px',
    borderTop: `1px solid ${theme.colors.border}`,
  },
}

const fieldStyles: Record<string, React.CSSProperties> = {
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontFamily: theme.fonts.ui,
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: theme.colors.muted,
  },
  input: {
    fontFamily: theme.fonts.body,
    fontSize: 15,
    padding: '9px 12px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    color: theme.colors.onPrimary,
    outline: 'none',
    width: '100%',
  },
}
