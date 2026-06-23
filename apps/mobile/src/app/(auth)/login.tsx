import Button from '@/src/components/ui/Button';
import FormField from '@/src/components/ui/FormField';
import { useAuth } from '@/src/store/auth/AuthContext';
import { theme } from '@/src/theme';
import { Link, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const goBackToApp = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/accueil');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable
          onPress={goBackToApp}
          hitSlop={8}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
        >
          <ChevronLeft size={24} color={theme.colors.espresso} strokeWidth={2.4} />
        </Pressable>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.overline}>Bienvenue chez</Text>
            <Text style={styles.logo}>Elegante Amaro</Text>
            <Text style={styles.subtitle}>Heureux de vous revoir</Text>
          </View>

          <View style={styles.form}>
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="vous@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <FormField
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              label="Se connecter"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submit}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <Link href="/register" replace asChild>
              <Pressable hitSlop={8}>
                <Text style={styles.footerLink}>Créer un compte</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  backPressed: {
    opacity: 0.7,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  overline: {
    ...theme.typography.label,
    color: theme.colors.goldDark,
  },
  logo: {
    ...theme.typography.logo,
    color: theme.colors.espresso,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  form: {
    gap: theme.spacing.lg,
  },
  error: {
    ...theme.typography.body,
    color: theme.colors.danger,
  },
  submit: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  footerLink: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
    color: theme.colors.goldDark,
  },
});
