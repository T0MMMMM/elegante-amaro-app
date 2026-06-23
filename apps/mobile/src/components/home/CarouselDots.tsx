import { theme } from '@/src/theme';
import { StyleSheet, View } from 'react-native';

interface Props {
  total: number;
  index: number;
}

/** Indicateur de position du carrousel (point actif allongé). */
export default function CarouselDots({ total, index }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === index ? styles.active : styles.idle]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 6,
    borderRadius: theme.radius.pill,
  },
  active: {
    width: 22,
    backgroundColor: theme.colors.gold,
  },
  idle: {
    width: 6,
    backgroundColor: theme.colors.border,
  },
});
