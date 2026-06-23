import { useState } from 'react'
import { theme } from '@elegante-amaro-app/shared/constants'
import Button from './Button'

interface ConfirmDeleteModalProps {
  title: string
  message: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export default function ConfirmDeleteModal({ title, message, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setConfirming(true)
    setError(null)
    try {
      await onConfirm()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la suppression')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.footer}>
          <Button variant="ghost" onClick={onCancel} disabled={confirming}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={confirming}>
            {confirming ? 'Suppression…' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(33,33,33,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
  },
  dialog: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    width: '100%',
    maxWidth: 420,
    padding: '24px 28px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  title: {
    fontFamily: theme.fonts.body,
    fontSize: 18,
    fontWeight: 700,
    color: theme.colors.onPrimary,
  },
  message: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 1.5,
    margin: 0,
  },
  error: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.danger,
    lineHeight: 1.4,
    margin: 0,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
  },
}
