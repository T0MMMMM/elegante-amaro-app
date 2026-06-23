/**
 * Palette mobile — dérivée de la source unique partagée (@elegante-amaro-app/shared).
 * Aucune valeur hex n'est définie ici : on ne fait que mapper les tokens de marque
 * partagés vers les noms attendus par les composants mobile.
 */
import { colors as shared } from '@elegante-amaro-app/shared/constants/colors';

export const colors = {
  // base
  cream: shared.cream,
  espresso: shared.espresso,
  gold: shared.gold,
  goldDark: shared.goldDark,

  // surfaces
  surface: shared.cardSurface,
  surfaceAlt: shared.surfaceAlt,
  border: shared.borderSoft,

  // texte
  text: shared.text,
  textMuted: shared.textMuted,
  textOnGold: shared.textOnGold,
  textOnDark: shared.textOnDark,

  // états de commande (state_commands)
  success: shared.success,
  warning: shared.warning,
  danger: shared.dangerBrand,

  // divers
  overlay: shared.overlay,

  // alias sémantiques
  background: shared.background,
  accent: shared.accent,
} as const;

export type ColorToken = keyof typeof colors;
