import Button from '@/src/components/ui/Button';
import FadeInView from '@/src/components/ui/FadeInView';
import { formatPrice } from '@/src/constants/config';
import { useCartTotals } from '@/src/hooks/useCartTotals';
import { haptics } from '@/src/lib/haptics';
import { orderService } from '@/src/services/orderService';
import { userService } from '@/src/services/userService';
import { useAuth } from '@/src/store/auth/AuthContext';
import { useCart } from '@/src/store/cart/CartContext';
import { theme } from '@/src/theme';
import { CommandItem } from '@/src/types';
import { formatOrderNumber } from '@elegante-amaro-app/shared/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ guestName?: string; guestEmail?: string }>();
  const { user, signInAs } = useAuth();
  const { lines, typeId, tableId, clear } = useCart();
  const totals = useCartTotals();

  // Montant figé avant le vidage du panier.
  const [amount] = useState(() => totals.total);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false); // évite un double envoi concurrent
  const done = useRef(false);       // commande créée avec succès : ne pas rejouer

  // Le paiement est accepté : retour haptique de succès à l'arrivée.
  useEffect(() => {
    haptics.success();
  }, []);

  // Crée la commande. Réutilisable pour permettre une nouvelle tentative
  // si l'enregistrement échoue après un paiement déjà accepté (pas de
  // commande perdue : le panier n'est vidé qu'en cas de succès).
  const submitOrder = useCallback(async () => {
    if (submitting.current || done.current) return;
    submitting.current = true;
    setError(null);

    try {
      let userId: number;
      if (user) {
        userId = user.id;
      } else {
        // Commande invité : on crée/retrouve le compte et on l'y connecte.
        const guest = await userService.upsertGuest(
          params.guestName ?? '',
          params.guestEmail ?? '',
        );
        await signInAs(guest);
        userId = guest.id;
      }

      const items: CommandItem[] = lines.map((l, idx) => ({
        id: idx + 1,
        item: l.item,
        quantity: l.quantity,
        unitPrice: l.lineTotal / l.quantity,
        lineTotal: l.lineTotal,
        size: l.size,
        options: l.options,
      }));

      const command = await orderService.createCommand({
        userId,
        typeId,
        tableId,
        items,
        totalPrice: amount,
      });

      done.current = true;
      clear();
      setOrderNumber(formatOrderNumber(command.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible d’enregistrer la commande.');
    } finally {
      submitting.current = false;
    }
  }, [user, params.guestName, params.guestEmail, signInAs, lines, typeId, tableId, amount, clear]);

  // Crée la commande à l'arrivée sur l'écran.
  useEffect(() => {
    submitOrder();
  }, [submitOrder]);

  const pending = !orderNumber && !error;

  return (
    <View style={styles.root}>
      <FadeInView style={styles.center} offset={18}>
        <View style={styles.circle}>
          <Check size={56} color={theme.colors.cream} strokeWidth={3} />
        </View>
      </FadeInView>

      <FadeInView delay={140} style={styles.center}>
        <Text style={styles.title}>Paiement accepté</Text>
        <Text style={styles.subtitle}>
          Votre règlement de {formatPrice(amount)} a bien été accepté.
        </Text>
      </FadeInView>

      {pending ? (
        <View style={styles.pending}>
          <ActivityIndicator color={theme.colors.gold} />
          <Text style={styles.pendingText}>Enregistrement de votre commande…</Text>
        </View>
      ) : null}

      {orderNumber ? (
        <FadeInView delay={120} style={styles.recap}>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Commande</Text>
            <Text style={styles.recapValue}>{orderNumber}</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Statut</Text>
            <Text style={styles.recapState}>En attente</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Total payé</Text>
            <Text style={styles.recapTotal}>{formatPrice(amount)}</Text>
          </View>
        </FadeInView>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {error ? (
        <Button
          label="Réessayer"
          onPress={submitOrder}
          style={styles.button}
        />
      ) : null}

      <Button
        label="Retour à l'accueil"
        onPress={() => router.replace('/accueil')}
        disabled={pending}
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
  center: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.success,
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
  pending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  pendingText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
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
  recapValue: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
    color: theme.colors.espresso,
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
  error: {
    ...theme.typography.body,
    color: theme.colors.danger,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.lg,
  },
});
