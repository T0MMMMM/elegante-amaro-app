import QuantityStepper from '@/src/components/ui/QuantityStepper';
import { formatPrice } from '@/src/constants/config';
import { CartLine } from '@/src/store/cart/cart.types';
import { SIZES } from '@/src/types';
import { theme } from '@/src/theme';
import { Image } from 'expo-image';
import { Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  line: CartLine;
  onChangeQty: (quantity: number) => void;
  onRemove: () => void;
}

/** Ligne du panier : visuel, nom, taille/options, quantité, total, suppression. */
export default function CartLineRow({ line, onChangeQty, onRemove }: Props) {
  const sizeLabel = SIZES.find((s) => s.value === line.size)?.label ?? line.size;
  const optionsLabel = line.options.map((o) => o.name).join(' · ');

  return (
    <View style={styles.row}>
      <Image source={line.item.image} style={styles.image} contentFit="cover" transition={200} />

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {line.item.name}
          </Text>
          <Pressable onPress={onRemove} hitSlop={8}>
            <Trash2 size={18} color={theme.colors.textMuted} />
          </Pressable>
        </View>

        <Text style={styles.meta} numberOfLines={1}>
          {sizeLabel}
          {optionsLabel ? ` · ${optionsLabel}` : ''}
        </Text>

        <View style={styles.footer}>
          <QuantityStepper value={line.quantity} onChange={onChangeQty} size="sm" />
          <Text style={styles.total}>{formatPrice(line.lineTotal)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.soft,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 15,
    color: theme.colors.espresso,
  },
  meta: {
    fontFamily: theme.fontFamily.body,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  total: {
    fontFamily: theme.fontFamily.display,
    fontSize: 20,
    color: theme.colors.goldDark,
  },
});
