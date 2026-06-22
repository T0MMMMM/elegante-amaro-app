import { theme } from '@/src/theme';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

type Props = TextInputProps & {
  label: string;
  containerStyle?: ViewStyle;
};

/** Champ de formulaire (label + input) — style « crème raffiné » de l'app. */
export default function FormField({ label, containerStyle, ...props }: Props) {
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
});
