import CartLineRow from '@/src/components/order/CartLineRow';
import CartSummary from '@/src/components/order/CartSummary';
import EmptyCart from '@/src/components/order/EmptyCart';
import OrderTypeSelector from '@/src/components/order/OrderTypeSelector';
import TableSelector from '@/src/components/order/TableSelector';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import SectionHeader from '@/src/components/ui/SectionHeader';
import { useCartTotals } from '@/src/hooks/useCartTotals';
import { useLiveData } from '@/src/hooks/useLiveData';
import { orderService } from '@/src/services/orderService';
import { useAuth } from '@/src/store/auth/AuthContext';
import { useCart } from '@/src/store/cart/CartContext';
import { theme } from '@/src/theme';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CommandeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { lines, typeId, tableId, updateQty, removeLine, setType, setTable } = useCart();
  const totals = useCartTotals();

  const { data: typesData } = useLiveData(() => orderService.getCommandTypes());
  const { data: tablesData } = useLiveData(() => orderService.getTables());
  const types = typesData ?? [];
  const tables = tablesData ?? [];

  if (lines.length === 0) {
    return (
      <ScreenContainer>
        <EmptyCart onBrowse={() => router.push('/carte')} />
      </ScreenContainer>
    );
  }

  // Le panier n'est pas vidé ici : la commande est créée après un paiement
  // réussi. Un invité passe d'abord par la saisie de ses informations.
  const handleValidate = () => {
    if (user) router.push('/checkout/payment');
    else router.push('/checkout/guest-info');
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader overline="Votre sélection" title="Votre panier" />

        <View style={styles.lines}>
          {lines.map((line) => (
            <CartLineRow
              key={line.id}
              line={line}
              onChangeQty={(qty) => updateQty(line.id, qty)}
              onRemove={() => removeLine(line.id)}
            />
          ))}
        </View>

        <Text style={styles.blockTitle}>Votre service</Text>
        <OrderTypeSelector types={types} selectedId={typeId} onSelect={setType} />

        {typeId === 1 ? (
          <>
            <Text style={styles.blockTitle}>Votre table</Text>
            <TableSelector tables={tables} selectedId={tableId} onSelect={setTable} />
          </>
        ) : null}

        <View style={styles.summary}>
          <CartSummary totals={totals} onValidate={handleValidate} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.huge,
    gap: theme.spacing.lg,
  },
  lines: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  blockTitle: {
    fontFamily: theme.fontFamily.display,
    fontSize: 20,
    letterSpacing: 0.5,
    color: theme.colors.espresso,
    marginTop: theme.spacing.sm,
  },
  summary: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.soft,
  },
});
