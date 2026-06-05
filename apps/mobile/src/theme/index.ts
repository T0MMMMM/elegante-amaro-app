import { colors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { fontFamily, typography } from './typography';

export const theme = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
  fontFamily,
} as const;

export type Theme = typeof theme;

export { colors, spacing, radius, shadows, typography, fontFamily };
