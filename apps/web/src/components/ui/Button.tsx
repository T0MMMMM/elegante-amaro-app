import { CSSProperties, ReactNode, useState } from 'react'
import { theme } from '@elegante-amaro-app/shared/constants'

type Variant = 'primary' | 'danger' | 'ghost'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: Variant
  type?: 'button' | 'submit'
  disabled?: boolean
}

const base: CSSProperties = {
  fontFamily: theme.fonts.ui,
  fontSize: 11,
  letterSpacing: '0.08em',
  padding: '9px 20px',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'background 0.15s, opacity 0.15s',
}

const variantStyles: Record<Variant, CSSProperties> = {
  primary: { backgroundColor: theme.colors.accent, color: '#fff' },
  danger: { backgroundColor: theme.colors.danger, color: '#fff' },
  ghost: {
    backgroundColor: 'transparent',
    color: theme.colors.onPrimary,
    border: `1px solid ${theme.colors.border}`,
  },
}

const hoverBg: Record<Variant, string> = {
  primary: theme.colors.accentHover,
  danger: theme.colors.dangerHover,
  ghost: theme.colors.border,
}

export default function Button({ children, onClick, variant = 'primary', type = 'button', disabled }: ButtonProps) {
  const [hovered, setHovered] = useState(false)

  const bg = hovered ? hoverBg[variant] : (variantStyles[variant].backgroundColor as string)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...variantStyles[variant], backgroundColor: bg, opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </button>
  )
}
