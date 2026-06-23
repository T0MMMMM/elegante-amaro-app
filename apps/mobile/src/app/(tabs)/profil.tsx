import OngoingOrderCard from '@/src/components/order/OngoingOrderCard';
import FidelityCard from '@/src/components/profile/FidelityCard';
import ProfileRow from '@/src/components/profile/ProfileRow';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Divider from '@/src/components/ui/Divider';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import { useLiveData } from '@/src/hooks/useLiveData';
import { orderService } from '@/src/services/orderService';
import { useAuth } from '@/src/store/auth/AuthContext';
import { theme } from '@/src/theme';
import { useRouter } from 'expo-router';
import { ClipboardList, LogOut, Settings, UserCog, UserRound } from 'lucide-react-native';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ProfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Suivi de commande : refetch au focus + polling toutes les 8 s tant que l'écran est visible.
  const { data, refreshing, refresh } = useLiveData(
    () => (user ? orderService.getOngoingCommands(user.id) : Promise.resolve([])),
    { pollMs: 8000, enabled: !!user },
  );
  const ongoing = data ?? [];

  if (!user) {
    return (
      <ScreenContainer>
        <ScrollView
          contentContainerStyle={styles.guestScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.guestHeader}>
            <View style={styles.guestAvatar}>
              <UserRound size={32} color={theme.colors.goldDark} strokeWidth={2} />
            </View>
            <Text style={styles.guestTitle}>Bienvenue</Text>
            <Text style={styles.guestSubtitle}>
              Connectez-vous pour suivre vos commandes et rejoindre le cercle Elegante Amaro.
            </Text>
          </View>

          <View style={styles.guestActions}>
            <Button label="Se connecter" onPress={() => router.push('/login')} />
            <Button
              label="Créer un compte"
              variant="outline"
              onPress={() => router.push('/register')}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
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
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user.name)}</Text>
          </View>
          <View style={styles.identity}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <FidelityCard points={user.fidelityPoints} />

        {ongoing.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Commandes en cours</Text>
            <View style={styles.list}>
              {ongoing.map((order) => (
                <OngoingOrderCard key={order.id} order={order} />
              ))}
            </View>
          </View>
        ) : null}

        <Card style={styles.menu}>
          <ProfileRow
            icon={ClipboardList}
            label="Historique des commandes"
            onPress={() => router.push('/orders')}
          />
          <Divider />
          <ProfileRow
            icon={UserCog}
            label="Mes informations"
            onPress={() => router.push('/account')}
          />
          <Divider />
          <ProfileRow icon={Settings} label="Paramètres" onPress={() => router.push('/settings')} />
        </Card>

        <Card style={styles.menu}>
          <ProfileRow icon={LogOut} label="Déconnexion" danger onPress={logout} />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.huge,
    gap: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: theme.fontFamily.display,
    fontSize: 26,
    color: theme.colors.espresso,
  },
  identity: {
    gap: 2,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.espresso,
  },
  email: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
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
  menu: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
  guestScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.xxl,
  },
  guestHeader: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  guestAvatar: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  guestTitle: {
    ...theme.typography.h2,
    color: theme.colors.espresso,
  },
  guestSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  guestActions: {
    gap: theme.spacing.md,
  },
});
