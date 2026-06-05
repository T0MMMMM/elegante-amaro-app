import Price from '@/src/components/ui/Price';
import { Item } from '@/src/types';
import { theme } from '@/src/theme';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  item: Item;
  onPress: () => void;
}

/** Carte produit pour la grille de la Carte. */
export default function ItemCard({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image
        source={item.image}
        style={styles.image}
        contentFit="cover"
        transition={250}
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.footer}>
          <Price value={item.price} size={20} />
          <View style={styles.plus}>
            <Plus size={16} color={theme.colors.espresso} strokeWidth={2.5} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: '100%',
    height: 124,
    backgroundColor: theme.colors.surfaceAlt,
  },
  body: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  name: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
    color: theme.colors.espresso,
    minHeight: 38,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  plus: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
