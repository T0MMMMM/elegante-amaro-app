import { formatPrice } from '@/src/constants/config';
import { ItemOption } from '@/src/types';
import { theme } from '@/src/theme';
import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  option: ItemOption;
  selected: boolean;
  onToggle: () => void;
}

/** Ligne d'option (extra) sélectionnable avec son supplément de prix. */
export default function OptionToggle({ option, selected, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.box, selected ? styles.boxOn : styles.boxOff]}>
        {selected ? <Check size={14} color={theme.colors.espresso} strokeWidth={3} /> : null}
      </View>
      <Text style={styles.name}>{option.name}</Text>
      <Text style={styles.extra}>+ {formatPrice(option.extraPrice)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOff: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  boxOn: {
    borderColor: theme.colors.gold,
    backgroundColor: theme.colors.gold,
  },
  name: {
    flex: 1,
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 15,
    color: theme.colors.espresso,
  },
  extra: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
    color: theme.colors.goldDark,
  },
});
