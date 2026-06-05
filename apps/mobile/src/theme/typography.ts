import { TextStyle } from 'react-native';

/** Familles de polices (clés = noms exportés par @expo-google-fonts). */
export const fontFamily = {
  script: 'PinyonScript_400Regular',
  display: 'BebasNeue_400Regular',
  body: 'Montserrat_400Regular',
  bodyMedium: 'Montserrat_500Medium',
  bodySemibold: 'Montserrat_600SemiBold',
  bodyBold: 'Montserrat_700Bold',
} as const;

/** Styles de texte prêts à l'emploi (police + taille + interligne + tracking). */
export const typography = {
  logo: {
    fontFamily: fontFamily.script,
    fontSize: 46,
    lineHeight: 54,
  },
  h1: {
    fontFamily: fontFamily.display,
    fontSize: 40,
    letterSpacing: 1,
  },
  h2: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    letterSpacing: 0.5,
  },
  h3: {
    fontFamily: fontFamily.display,
    fontSize: 22,
    letterSpacing: 0.5,
  },
  price: {
    fontFamily: fontFamily.display,
    fontSize: 24,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: fontFamily.bodySemibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 21,
  },
  bodyStrong: {
    fontFamily: fontFamily.bodySemibold,
    fontSize: 14,
    lineHeight: 21,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    lineHeight: 17,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
