import { theme } from '@/src/theme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Chargement « maison » : le logo en script qui respire doucement — pas de spinner brut. */
export default function ScreenLoader({ label = 'Elegante Amaro' }: { label?: string }) {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 950, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.45, duration: 950, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <SafeAreaView style={styles.root}>
      <Animated.Text style={[styles.logo, { opacity: pulse }]}>{label}</Animated.Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    ...theme.typography.logo,
    color: theme.colors.espresso,
  },
});
