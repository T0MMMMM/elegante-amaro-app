import { theme } from '@/src/theme';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
}

/** En-tête de sous-page : bouton retour + titre. */
export default function ScreenHeader({ title }: Props) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <ChevronLeft size={24} color={theme.colors.espresso} strokeWidth={2.4} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.espresso,
  },
});
