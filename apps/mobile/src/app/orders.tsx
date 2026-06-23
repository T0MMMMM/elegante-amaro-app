import Button from '@/src/components/ui/Button';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { formatPrice } from '@/src/constants/config';
import { useLiveData } from '@/src/hooks/useLiveData';
import { orderService } from '@/src/services/orderService';
import { useAuth } from '@/src/store/auth/AuthContext';
import { theme } from '@/src/theme';
import { useRouter } from 'expo-router';
import { Package } from 'lucide-react-native';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const { data, refreshing, refresh } = useLiveData(
    () => (user ? orderService.getUserCommands(user.id) : Promise.resolve([])),
    { enabled: !!user },
  );
  const past = data ?? [];

  if (!user) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Historique" />
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Connectez-vous</Text>
          <Text style={styles.emptyText}>
            Connectez-vous pour retrouver l’historique de vos commandes.
          </Text>
          <Button label="Se connecter" onPress={() => router.push('/login')} style={styles.emptyBtn} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Historique" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.gold}
            colors={[theme.colors.gold]}
          />
        }
      >
        {past.length > 0 ? (
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
                  <Text style={[styles.state, { color: item.stateColor || theme.colors.textMuted }]}>
                    {item.stateLabel}
                  </Text>
                </View>
                <Text style={styles.total}>{formatPrice(item.total)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noneText}>Vous n’avez pas encore de commande terminée.</Text>
        )}
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: theme.colors.espresso,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: theme.spacing.md,
    alignSelf: 'stretch',
  },
  noneText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
});
