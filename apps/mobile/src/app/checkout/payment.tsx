import Button from '@/src/components/ui/Button';
import FormField from '@/src/components/ui/FormField';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { formatPrice } from '@/src/constants/config';
import { useCartTotals } from '@/src/hooks/useCartTotals';
import { theme } from '@/src/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/** Probabilité de succès du faux paiement. */
const SUCCESS_RATE = 0.8;

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ guestName?: string; guestEmail?: string }>();
  const totals = useCartTotals();

  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // Faux traitement bancaire : délai puis issue aléatoire.
    setTimeout(() => {
      const success = Math.random() < SUCCESS_RATE;
      router.replace({
        pathname: success ? '/checkout/payment-success' : '/checkout/payment-failure',
        params: {
          guestName: params.guestName ?? '',
          guestEmail: params.guestEmail ?? '',
        },
      });
    }, 1800);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Paiement" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Montant à régler</Text>
            <Text style={styles.amount}>{formatPrice(totals.total)}</Text>
          </View>

          <View style={styles.secureRow}>
            <Lock size={14} color={theme.colors.textMuted} strokeWidth={2} />
            <Text style={styles.secureText}>Paiement sécurisé (simulation)</Text>
          </View>

          <FormField
            label="Numéro de carte"
            value={card}
            onChangeText={setCard}
            placeholder="4242 4242 4242 4242"
            keyboardType="number-pad"
          />
          <View style={styles.row}>
            <FormField
              label="Expiration"
              value={expiry}
              onChangeText={setExpiry}
              placeholder="MM/AA"
              keyboardType="number-pad"
              containerStyle={styles.flex1}
            />
            <FormField
              label="CVC"
              value={cvc}
              onChangeText={setCvc}
              placeholder="123"
              keyboardType="number-pad"
              secureTextEntry
              containerStyle={styles.flex1}
            />
          </View>
          <FormField
            label="Titulaire de la carte"
            value={name}
            onChangeText={setName}
            placeholder="Prénom Nom"
            autoCapitalize="words"
          />

          <Button
            label={`Payer ${formatPrice(totals.total)}`}
            onPress={handlePay}
            loading={processing}
            style={styles.pay}
          />
          <Text style={styles.disclaimer}>
            Démo : aucun vrai paiement n’est effectué, le résultat est simulé.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.huge,
    gap: theme.spacing.lg,
  },
  amountCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.xs,
    ...theme.shadows.soft,
  },
  amountLabel: {
    ...theme.typography.label,
    color: theme.colors.goldDark,
  },
  amount: {
    ...theme.typography.h1,
    fontSize: 40,
    color: theme.colors.espresso,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  secureText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  pay: {
    marginTop: theme.spacing.md,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
