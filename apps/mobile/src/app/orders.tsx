import OngoingOrderCard from '@/src/components/order/OngoingOrderCard';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { formatPrice } from '@/src/constants/config';
import { orderService } from '@/src/services/orderService';
import { theme } from '@/src/theme';
import { OngoingOrder, OrderSummary } from '@/src/types';
import { Package } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function stateColor(label: string): string {
  if (label === 'Servie') return theme.colors.success;
  if (label === 'Annulée') return theme.colors.danger;
  return theme.colors.warning;
}

export default function OrdersScreen() {
  const [ongoing, setOngoing] = useState<OngoingOrder[]>([]);
  const [past, setPast] = useState<OrderSummary[]>([]);

  useEffect(() => {
    orderService.getOngoingCommands().then(setOngoing);
    orderService.getUserCommands().then(setPast);
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader title="Mes commandes" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ongoing.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>En cours</Text>
            <View style={styles.list}>
              {ongoing.map((order) => (
                <OngoingOrderCard key={order.id} order={order} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique</Text>
          <View style={styles.list}>
            {past.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.iconWrap}>
                  <Package size={22} color={theme.colors.goldDark} strokeWidth={2} />
                </View>
                <View style={styles.middle}>
                  <Text style={styles.number}>Commande {item.number}</Text>
                  <Text style={styles.meta}>
                    {item.dateLabel} · {item.itemCount} article{item.itemCount > 1 ? 's' : ''}
                  </Text>
                  <Text style={[styles.state, { color: stateColor(item.stateLabel) }]}>
                    {item.stateLabel}
                  </Text>
                </View>
                <Text style={styles.total}>{formatPrice(item.total)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.huge,
    gap: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.label,
    color: theme.colors.goldDark,
  },
  list: {
    gap: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    gap: 2,
  },
  number: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 15,
    color: theme.colors.espresso,
  },
  meta: {
    fontFamily: theme.fontFamily.body,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  state: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 12,
    marginTop: 2,
  },
  total: {
    fontFamily: theme.fontFamily.display,
    fontSize: 22,
    color: theme.colors.goldDark,
  },
});
