import Button from '@/src/components/ui/Button';
import FormField from '@/src/components/ui/FormField';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { useAuth } from '@/src/store/auth/AuthContext';
import { theme } from '@/src/theme';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

export default function AccountScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Écran réservé aux utilisateurs connectés.
  if (!user) return <Redirect href="/login" />;

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Le nom et l’email sont requis.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ name, email, password: password || undefined });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Mes informations" />
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
            Ces informations correspondent à ton compte. Laisse le mot de passe vide pour ne pas le
            changer.
          </Text>

          <FormField label="Nom complet" value={name} onChangeText={setName} autoCapitalize="words" />
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormField
            label="Nouveau mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="Laisser vide pour ne pas changer"
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Enregistrer" loading={saving} onPress={handleSave} style={styles.save} />
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
  save: {
    marginTop: theme.spacing.md,
  },
});
