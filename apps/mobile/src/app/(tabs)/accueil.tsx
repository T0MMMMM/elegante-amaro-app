import CoffeeCarousel from '@/src/components/home/CoffeeCarousel';
import CoffeeStage3D from '@/src/components/home/CoffeeStage3D';
import Button from '@/src/components/ui/Button';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import { menuService } from '@/src/services/menuService';
import { theme } from '@/src/theme';
import { Item } from '@/src/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AccueilScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    menuService.getFeaturedItems().then(setItems);
  }, []);

  if (items.length === 0) return <ScreenContainer />;

  const current = items[index];
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.overline}>Bienvenue chez</Text>
        <Text style={styles.logo}>Elegante Amaro</Text>
      </View>

      <CoffeeStage3D modelSource={current.model3d} style={styles.stage} />

      <View style={styles.bottom}>
        <CoffeeCarousel
          item={current}
          index={index}
          total={items.length}
          onPrev={prev}
          onNext={next}
        />
        <Button
          label="Commander"
          onPress={() => router.push(`/item/${current.slug}`)}
          style={styles.cta}
        />
      </View>
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
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  cta: {
    marginHorizontal: theme.spacing.xl,
  },
});
