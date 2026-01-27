
import { Ballet_400Regular } from '@expo-google-fonts/ballet';
import { EBGaramond_400Regular, EBGaramond_700Bold } from '@expo-google-fonts/eb-garamond';
import { GravitasOne_400Regular } from '@expo-google-fonts/gravitas-one';
import { Unbounded_400Regular } from '@expo-google-fonts/unbounded';
import { useFonts } from "expo-font";

export default function useFont() {
    const [fontsLoaded] = useFonts({
        'Vivaldi': require('@/src/public/fonts/vivaldii.ttf'),
        Ballet_400Regular,
        Unbounded_400Regular,
        EBGaramond_400Regular,
        EBGaramond_700Bold,
        GravitasOne_400Regular,
    });

    return fontsLoaded;
}
