import Button from '@/src/components/ui/Button';
import Price from '@/src/components/ui/Price';
import { haptics } from '@/src/lib/haptics';
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

  const handleAdd = () => {
    haptics.medium();
    onAdd();
  };
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) }]}>
      <View style={styles.totalBlock}>
        <Text style={styles.totalLabel}>Total</Text>
        <Price value={total} size={26} color={theme.colors.espresso} />
      </View>
      <Button label="Ajouter au panier" onPress={handleAdd} style={styles.button} />
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
  button: {
    flex: 1,
  },
});
