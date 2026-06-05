/**
 * Palette « crème raffiné » — validée avec l'utilisateur.
 * Base : crème #FFFAED, espresso #2A1F15, accent doré/cuivre #BF9D7B.
 */
export const colors = {
  // base
  cream: '#FFFAED',
  espresso: '#2A1F15',
  gold: '#BF9D7B',
  goldDark: '#A07E54',

  // surfaces
  surface: '#FFFFFF',
  surfaceAlt: '#F4ECDD',
  border: '#E7DCC4',

  // texte
  text: '#2A1F15',
  textMuted: '#8A7E6E',
  textOnGold: '#2A1F15',
  textOnDark: '#FFFAED',

  // états de commande (state_commands)
  success: '#6B8E5A',
  warning: '#C9893F',
  danger: '#B4533F',

  // divers
  overlay: 'rgba(42, 31, 21, 0.5)',

  // alias sémantiques
  background: '#FFFAED',
  accent: '#BF9D7B',
} as const;

export type ColorToken = keyof typeof colors;
