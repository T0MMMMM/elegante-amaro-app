import Card from '@/src/components/ui/Card';
import Divider from '@/src/components/ui/Divider';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { theme } from '@/src/theme';
import {
  Bell,
  ChevronRight,
  Globe,
  Info,
  Megaphone,
  Moon,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [offersEnabled, setOffersEnabled] = useState(false);
  const [darkEnabled, setDarkEnabled] = useState(false);

  return (
    <ScreenContainer>
      <ScreenHeader title="Paramètres" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Notifications</Text>
        <Card style={styles.card}>
          <ToggleRow icon={Bell} label="Notifications push" value={pushEnabled} onValueChange={setPushEnabled} />
          <Divider />
          <ToggleRow
            icon={Megaphone}
            label="Offres & nouveautés"
            value={offersEnabled}
            onValueChange={setOffersEnabled}
          />
        </Card>

        <Text style={styles.section}>Préférences</Text>
        <Card style={styles.card}>
          <ToggleRow icon={Moon} label="Mode sombre" value={darkEnabled} onValueChange={setDarkEnabled} />
          <Divider />
          <LinkRow icon={Globe} label="Langue" value="Français" />
        </Card>

        <Text style={styles.section}>À propos</Text>
        <Card style={styles.card}>
          <LinkRow icon={ShieldCheck} label="Confidentialité" />
          <Divider />
          <LinkRow icon={Info} label="Version" value="1.0.0" />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  value,
  onValueChange,
}: {
  icon: LucideIcon;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <RowIcon icon={Icon} />
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: theme.colors.gold, false: theme.colors.border }}
        thumbColor={theme.colors.surface}
      />
    </View>
  );
}

function LinkRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <RowIcon icon={Icon} />
      <Text style={styles.label}>{label}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      <ChevronRight size={20} color={theme.colors.textMuted} />
    </Pressable>
  );
}

function RowIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <View style={styles.iconWrap}>
      <Icon size={20} color={theme.colors.espresso} strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.huge,
    gap: theme.spacing.md,
  },
  section: {
    ...theme.typography.label,
    color: theme.colors.goldDark,
    marginTop: theme.spacing.md,
  },
  card: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 15,
    color: theme.colors.espresso,
  },
  value: {
    fontFamily: theme.fontFamily.body,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
});
