import CartLineRow from '@/src/components/order/CartLineRow';
import CartSummary from '@/src/components/order/CartSummary';
import EmptyCart from '@/src/components/order/EmptyCart';
import OrderTypeSelector from '@/src/components/order/OrderTypeSelector';
import TableSelector from '@/src/components/order/TableSelector';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import SectionHeader from '@/src/components/ui/SectionHeader';
import { useCartTotals } from '@/src/hooks/useCartTotals';
import { orderService } from '@/src/services/orderService';
import { useCart } from '@/src/store/cart/CartContext';
import { theme } from '@/src/theme';
import { CafeTable, CommandItem, CommandType } from '@/src/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CommandeScreen() {
  const router = useRouter();
  const { lines, typeId, tableId, updateQty, removeLine, setType, setTable, clear } = useCart();
  const totals = useCartTotals();

  const [types, setTypes] = useState<CommandType[]>([]);
  const [tables, setTables] = useState<CafeTable[]>([]);

  useEffect(() => {
    orderService.getCommandTypes().then(setTypes);
    orderService.getTables().then(setTables);
  }, []);

  if (lines.length === 0) {
    return (
      <ScreenContainer>
        <EmptyCart onBrowse={() => router.push('/carte')} />
      </ScreenContainer>
    );
  }

  const handleValidate = async () => {
    const items: CommandItem[] = lines.map((l, idx) => ({
      id: idx + 1,
      item: l.item,
      quantity: l.quantity,
      unitPrice: l.lineTotal / l.quantity,
      lineTotal: l.lineTotal,
      size: l.size,
      options: l.options,
    }));

    await orderService.createCommand({
      userId: 1,
      typeId,
      tableId,
      items,
      totalPrice: totals.total,
    });

    clear();
    router.push({
      pathname: '/order-confirmation',
      params: { total: totals.total.toFixed(2), typeId: String(typeId) },
    });
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader overline="Votre sélection" title="Panier" />

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

        <Text style={styles.blockTitle}>Mode de service</Text>
        <OrderTypeSelector types={types} selectedId={typeId} onSelect={setType} />

        {typeId === 1 ? (
          <>
            <Text style={styles.blockTitle}>Numéro de table</Text>
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
