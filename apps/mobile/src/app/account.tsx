import Button from '@/src/components/ui/Button';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { userService } from '@/src/services/userService';
import { theme } from '@/src/theme';
import { ClientInfo } from '@/src/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

export default function AccountScreen() {
  const router = useRouter();
  const [info, setInfo] = useState<ClientInfo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userService.getClientInfo().then(setInfo);
  }, []);

  if (!info) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Mes informations" />
      </ScreenContainer>
    );
  }

  const set = (key: keyof ClientInfo) => (value: string) =>
    setInfo((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSave = async () => {
    setSaving(true);
    await userService.updateClientInfo(info);
    setSaving(false);
    router.back();
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
            Pas de livraison : ces informations servent à votre compte et à vos reçus.
          </Text>

          <Field label="Nom complet" value={info.name} onChangeText={set('name')} />
          <Field
            label="Email"
            value={info.email}
            onChangeText={set('email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Téléphone"
            value={info.phone}
            onChangeText={set('phone')}
            keyboardType="phone-pad"
          />
          <Field label="Adresse" value={info.address} onChangeText={set('address')} />
          <View style={styles.row}>
            <Field
              label="Code postal"
              value={info.postalCode}
              onChangeText={set('postalCode')}
              keyboardType="number-pad"
              containerStyle={styles.flex1}
            />
            <Field
              label="Ville"
              value={info.city}
              onChangeText={set('city')}
              containerStyle={styles.flex2}
            />
          </View>

          <Button label="Enregistrer" loading={saving} onPress={handleSave} style={styles.save} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

type FieldProps = TextInputProps & {
  label: string;
  containerStyle?: object;
};

function Field({ label, containerStyle, ...props }: FieldProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.textMuted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
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
  field: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.goldDark,
  },
  input: {
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 15,
    color: theme.colors.espresso,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  save: {
    marginTop: theme.spacing.md,
  },
});
