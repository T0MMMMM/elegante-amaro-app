import { theme } from '@/src/theme';
import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={({ pressed }) => [
          styles.btn,
          { width: dim, height: dim },
          value <= min && styles.btnDisabled,
          pressed && styles.pressed,
        ]}
      >
        <Minus size={icon} color={theme.colors.espresso} strokeWidth={2.5} />
      </Pressable>

      <Text style={styles.value}>{value}</Text>

      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={({ pressed }) => [
          styles.btn,
          { width: dim, height: dim },
          value >= max && styles.btnDisabled,
          pressed && styles.pressed,
        ]}
      >
        <Plus size={icon} color={theme.colors.espresso} strokeWidth={2.5} />
      </Pressable>
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
  pressed: {
    opacity: 0.7,
  },
  value: {
    fontFamily: theme.fontFamily.display,
    fontSize: 20,
    color: theme.colors.espresso,
    minWidth: 24,
    textAlign: 'center',
  },
});
