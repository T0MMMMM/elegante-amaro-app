import { Platform, ViewStyle } from 'react-native';

/**
 * Ombres douces pour l'effet « posé / luxe ».
 * iOS via shadow*, Android via elevation.
 */
const make = (
  elevation: number,
  radius: number,
  opacity: number,
  offsetY: number,
): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#2A1F15',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {},
  })!;

export const shadows = {
  soft: make(2, 6, 0.08, 2),
  card: make(5, 14, 0.12, 6),
  lifted: make(10, 24, 0.18, 12),
} as const;

export type ShadowToken = keyof typeof shadows;
