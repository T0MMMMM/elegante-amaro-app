/**
 * Palette « crème raffiné » — source unique pour les 3 apps (web, mobile, api).
 * Base : crème #FFFAED, espresso #2A1F15, accent doré/cuivre #BF9D7B.
 *
 * Deux familles de tokens cohabitent dans un seul objet :
 *  - tokens sémantiques (primary/secondary/accent…) consommés par le web ;
 *  - tokens nommés de marque (cream/espresso/gold…) consommés par le mobile.
 * Toute valeur hex de l'app vit ici ; chaque app ne fait que mapper des noms.
 */
export const colors = {
  // ── Tokens sémantiques (web) ────────────────────────────────────────────────
  primary: '#FFFAED',
  onPrimary: '#2A1F15',
  secondary: '#2A1F15',
  onSecondary: '#FFFAED',
  accent: '#BF9D7B',
  accentHover: '#A8876A',
  surface: '#F5EDD8',
  border: '#D4BFA8',
  danger: '#c0392b',
  dangerHover: '#a93226',
  muted: '#8A6F55',

  // ── Tokens de marque nommés (mobile) ─────────────────────────────────────────
  cream: '#FFFAED',
  espresso: '#2A1F15',
  gold: '#BF9D7B',
  goldDark: '#A07E54',
  surfaceAlt: '#F4ECDD',
  text: '#2A1F15',
  textMuted: '#8A7E6E',
  textOnGold: '#2A1F15',
  textOnDark: '#FFFAED',
  success: '#6B8E5A',
  warning: '#C9893F',
  overlay: 'rgba(42, 31, 21, 0.5)',
  background: '#FFFAED',

  // Variantes de marque pour des noms qui entrent en collision avec le web.
  // (le mobile y mappe surface/border/danger ; le web garde ses valeurs ci-dessus)
  cardSurface: '#FFFFFF',
  borderSoft: '#E7DCC4',
  dangerBrand: '#B4533F',
} as const

export type ColorToken = keyof typeof colors
