import Button from '@/src/components/ui/Button';
import Divider from '@/src/components/ui/Divider';
import { formatPrice } from '@/src/constants/config';
import { CartTotals } from '@/src/hooks/useCartTotals';
import { theme } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  totals: CartTotals;
  onValidate: () => void;
  disabled?: boolean;
}

/** Récapitulatif des totaux + bouton de validation. */
export default function CartSummary({ totals, onValidate, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      <Line label="Sous-total (HT)" value={formatPrice(totals.subtotalHt)} muted />
      <Line
        label={`TVA (${Math.round(totals.tvaRate * 100)} %)`}
        value={formatPrice(totals.tvaAmount)}
        muted
      />
      <Divider style={styles.divider} />
      <Line label="Total" value={formatPrice(totals.total)} strong />

      <Button
        label="Valider la commande"
        onPress={onValidate}
        disabled={disabled}
        style={styles.button}
      />
    </View>
  );
}

function Line({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <View style={styles.line}>
      <Text style={[styles.label, muted && styles.muted, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.value, strong && styles.strongValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
  label: {
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 14,
    color: theme.colors.espresso,
  },
  muted: {
    color: theme.colors.textMuted,
  },
  strong: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 16,
  },
  value: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
    color: theme.colors.espresso,
  },
  strongValue: {
    fontFamily: theme.fontFamily.display,
    fontSize: 24,
    color: theme.colors.goldDark,
  },
  button: {
    marginTop: theme.spacing.lg,
  },
});
