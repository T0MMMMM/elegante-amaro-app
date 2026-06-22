import Button from '@/src/components/ui/Button';
import { theme } from '@/src/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function PaymentFailureScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ guestName?: string; guestEmail?: string }>();

  const retry = () => {
    router.replace({
      pathname: '/checkout/payment',
      params: {
        guestName: params.guestName ?? '',
        guestEmail: params.guestEmail ?? '',
      },
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.circle}>
        <X size={56} color={theme.colors.cream} strokeWidth={3} />
      </View>

      <Text style={styles.title}>Paiement refusé</Text>
      <Text style={styles.subtitle}>
        Ton paiement n’a pas pu être traité. Ton panier est conservé, tu peux réessayer.
      </Text>

      <Button label="Réessayer le paiement" onPress={retry} style={styles.button} />
      <Button
        label="Retour au panier"
        variant="outline"
        onPress={() => router.replace('/commande')}
        style={styles.buttonSecondary}
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
    backgroundColor: theme.colors.danger,
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
  button: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.lg,
  },
  buttonSecondary: {
    alignSelf: 'stretch',
  },
});
