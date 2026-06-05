import FidelityCard from '@/src/components/profile/FidelityCard';
import ProfileRow from '@/src/components/profile/ProfileRow';
import Card from '@/src/components/ui/Card';
import Divider from '@/src/components/ui/Divider';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import { userService } from '@/src/services/userService';
import { theme } from '@/src/theme';
import { User } from '@/src/types';
import { useRouter } from 'expo-router';
import { ClipboardList, LogOut, Settings, UserCog } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getCurrentUser().then(setUser);
  }, []);

  if (!user) return <ScreenContainer />;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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

        <Card style={styles.menu}>
          <ProfileRow
            icon={ClipboardList}
            label="Mes commandes"
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
          <ProfileRow icon={LogOut} label="Déconnexion" danger />
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
  menu: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
});
