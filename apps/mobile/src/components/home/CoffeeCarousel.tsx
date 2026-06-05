import Price from '@/src/components/ui/Price';
import { Item } from '@/src/types';
import { theme } from '@/src/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CarouselDots from './CarouselDots';

interface Props {
  item: Item;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

/** Bloc d'information sous la scène 3D : flèches, nom, prix, description, dots. */
export default function CoffeeCarousel({ item, index, total, onPrev, onNext }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <ArrowButton direction="left" onPress={onPrev} />
        <View style={styles.titleBlock}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Price value={item.price} size={26} />
        </View>
        <ArrowButton direction="right" onPress={onNext} />
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {item.description}
      </Text>

      <CarouselDots total={total} index={index} />
    </View>
  );
}

function ArrowButton({
  direction,
  onPress,
}: {
  direction: 'left' | 'right';
  onPress: () => void;
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.arrow, pressed && styles.arrowPressed]}
    >
      <Icon size={22} color={theme.colors.espresso} strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.espresso,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    minHeight: 63,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  arrowPressed: {
    opacity: 0.7,
  },
});
