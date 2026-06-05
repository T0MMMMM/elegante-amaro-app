import Button from '@/src/components/ui/Button';
import { formatPrice } from '@/src/constants/config';
import { theme } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  total: number;
  onAdd: () => void;
}

/** Barre collante bas d'écran : total live + ajout au panier. */
export default function AddToCartBar({ total, onAdd }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) }]}>
      <View style={styles.totalBlock}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
      </View>
      <Button label="Ajouter au panier" onPress={onAdd} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.cream,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalBlock: {
    gap: 2,
  },
  totalLabel: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
  },
  totalValue: {
    fontFamily: theme.fontFamily.display,
    fontSize: 26,
    color: theme.colors.espresso,
  },
  button: {
    flex: 1,
  },
});
