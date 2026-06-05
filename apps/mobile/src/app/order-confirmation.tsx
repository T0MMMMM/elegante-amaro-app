import Button from '@/src/components/ui/Button';
import { formatPrice } from '@/src/constants/config';
import { theme } from '@/src/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total: string }>();

  const orderNumber = useMemo(() => Math.floor(1000 + Math.random() * 9000), []);
  const totalValue = total ? parseFloat(total) : 0;

  return (
    <View style={styles.root}>
      <View style={styles.circle}>
        <Check size={56} color={theme.colors.espresso} strokeWidth={3} />
      </View>

      <Text style={styles.title}>Commande confirmée</Text>
      <Text style={styles.subtitle}>
        Merci ! Votre commande n°{orderNumber} est en attente de préparation.
      </Text>

      <View style={styles.recap}>
        <View style={styles.recapRow}>
          <Text style={styles.recapLabel}>Statut</Text>
          <Text style={styles.recapState}>En attente</Text>
        </View>
        <View style={styles.recapRow}>
          <Text style={styles.recapLabel}>Total payé</Text>
          <Text style={styles.recapTotal}>{formatPrice(totalValue)}</Text>
        </View>
      </View>

      <Button
        label="Retour à l'accueil"
        onPress={() => router.replace('/accueil')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.card,
  },
  title: {
    ...theme.typography.h1,
    fontSize: 36,
    color: theme.colors.espresso,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  recap: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    ...theme.shadows.soft,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recapLabel: {
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  recapState: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
    color: theme.colors.warning,
  },
  recapTotal: {
    fontFamily: theme.fontFamily.display,
    fontSize: 24,
    color: theme.colors.goldDark,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.lg,
  },
});
