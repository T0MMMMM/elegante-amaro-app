import Button from '@/src/components/ui/Button';
import FormField from '@/src/components/ui/FormField';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { theme } from '@/src/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GuestInfoScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!name.trim()) {
      setError('Veuillez renseigner votre nom complet.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Veuillez renseigner un email valide.');
      return;
    }
    setError(null);
    router.push({
      pathname: '/checkout/payment',
      params: { guestName: name.trim(), guestEmail: email.trim() },
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Vos informations" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.note}>
            Vous commandez en tant qu’invité. Ces informations servent à identifier votre commande.
          </Text>

          <FormField
            label="Nom complet"
            value={name}
            onChangeText={setName}
            placeholder="Prénom Nom"
            autoCapitalize="words"
          />
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="vous@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Continuer vers le paiement" onPress={handleNext} style={styles.next} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.huge,
    gap: theme.spacing.lg,
  },
  note: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  error: {
    ...theme.typography.body,
    color: theme.colors.danger,
  },
  next: {
    marginTop: theme.spacing.md,
  },
});
