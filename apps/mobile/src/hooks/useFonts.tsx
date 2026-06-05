import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { PinyonScript_400Regular } from '@expo-google-fonts/pinyon-script';
import { useFonts } from 'expo-font';

/** Charge les polices de l'app : Pinyon Script (logo), Bebas Neue (titres), Montserrat (texte). */
export default function useAppFonts(): boolean {
  const [fontsLoaded] = useFonts({
    PinyonScript_400Regular,
    BebasNeue_400Regular,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  return fontsLoaded;
}
