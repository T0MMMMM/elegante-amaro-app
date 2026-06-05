import { theme } from '@/src/theme';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/** Pastille sélectionnable (catégories, filtres). */
export default function Chip({ label, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipIdle,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: theme.spacing.lg,
    height: 38,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipIdle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.espresso,
    borderColor: theme.colors.espresso,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 13,
  },
  labelIdle: {
    color: theme.colors.textMuted,
  },
  labelSelected: {
    color: theme.colors.cream,
  },
});
