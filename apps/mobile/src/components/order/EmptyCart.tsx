import Button from '@/src/components/ui/Button';
import { theme } from '@/src/theme';
import { Coffee } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  onBrowse: () => void;
}

/** État vide du panier. */
export default function EmptyCart({ onBrowse }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.circle}>
        <Coffee size={48} color={theme.colors.gold} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>Votre panier est vide</Text>
      <Text style={styles.subtitle}>
        Découvrez notre carte et laissez-vous tenter par une création signature.
      </Text>
      <Button label="Voir la carte" onPress={onBrowse} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.espresso,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.sm,
    alignSelf: 'stretch',
  },
});
