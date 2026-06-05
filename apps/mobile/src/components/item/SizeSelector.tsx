import { SIZES, Size } from '@/src/types';
import { theme } from '@/src/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  value: Size;
  onChange: (size: Size) => void;
}

/** Sélecteur segmenté de taille : petit / moyen / grand. */
export default function SizeSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {SIZES.map((s) => {
        const selected = s.value === value;
        return (
          <Pressable
            key={s.value}
            onPress={() => onChange(s.value)}
            style={({ pressed }) => [
              styles.segment,
              selected ? styles.selected : styles.idle,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>
              {s.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  segment: {
    flex: 1,
    height: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  idle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  selected: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.gold,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
  },
  labelIdle: {
    color: theme.colors.textMuted,
  },
  labelSelected: {
    color: theme.colors.espresso,
  },
});
