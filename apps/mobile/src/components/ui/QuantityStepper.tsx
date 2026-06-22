import PressableScale from '@/src/components/ui/PressableScale';
import { theme } from '@/src/theme';
import { Minus, Plus } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

/** Sélecteur de quantité : − valeur + */
export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md' }: Props) {
  const dim = size === 'sm' ? 30 : 38;
  const icon = size === 'sm' ? 16 : 18;

  const pop = useRef(new Animated.Value(1)).current;
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    pop.setValue(1.25);
    Animated.spring(pop, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  }, [value, pop]);

  return (
    <View style={styles.row}>
      <PressableScale
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={[styles.btn, { width: dim, height: dim }, value <= min && styles.btnDisabled]}
      >
        <Minus size={icon} color={theme.colors.espresso} strokeWidth={2.5} />
      </PressableScale>

      <Animated.Text style={[styles.value, { transform: [{ scale: pop }] }]}>{value}</Animated.Text>

      <PressableScale
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={[styles.btn, { width: dim, height: dim }, value >= max && styles.btnDisabled]}
      >
        <Plus size={icon} color={theme.colors.espresso} strokeWidth={2.5} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  btn: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  value: {
    fontFamily: theme.fontFamily.display,
    fontSize: 20,
    color: theme.colors.espresso,
    minWidth: 24,
    textAlign: 'center',
  },
});
