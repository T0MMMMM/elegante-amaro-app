import CoffeeCarousel from '@/src/components/home/CoffeeCarousel';
import CoffeeStage3D from '@/src/components/home/CoffeeStage3D';
import Button from '@/src/components/ui/Button';
import FadeInView from '@/src/components/ui/FadeInView';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import ScreenLoader from '@/src/components/ui/ScreenLoader';
import { greeting } from '@/src/constants/greeting';
import { useLiveData } from '@/src/hooks/useLiveData';
import { menuService } from '@/src/services/menuService';
import { useAuth } from '@/src/store/auth/AuthContext';
import { theme } from '@/src/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

export default function AccueilScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data } = useLiveData(() => menuService.getFeaturedItems());
  const items = data ?? [];
  const [index, setIndex] = useState(0);

  if (items.length === 0) return <ScreenLoader />;

  const firstName = user?.name?.trim().split(' ')[0];
  const welcome = firstName ? `${greeting()}, ${firstName}` : greeting();

  // Clamp : la liste peut rétrécir après un refetch.
  const safeIndex = Math.min(index, items.length - 1);
  const current = items[safeIndex];
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <ScreenContainer>
      <FadeInView style={styles.header}>
        <Text style={styles.overline}>{welcome}</Text>
        <Text style={styles.logo}>Elegante Amaro</Text>
      </FadeInView>

      <CoffeeStage3D modelSource={current.model3d} style={styles.stage} />

      <FadeInView delay={120} style={styles.bottom}>
        <CoffeeCarousel
          item={current}
          index={safeIndex}
          total={items.length}
          onPrev={prev}
          onNext={next}
        />
        <Button
          label="Commander"
          onPress={() => router.push(`/item/${current.slug}`)}
          style={styles.cta}
        />
      </FadeInView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  overline: {
    ...theme.typography.label,
    color: theme.colors.goldDark,
  },
  logo: {
    ...theme.typography.logo,
    color: theme.colors.espresso,
  },
  stage: {
    flex: 1,
  },
  bottom: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  cta: {
    marginHorizontal: theme.spacing.xl,
  },
});
