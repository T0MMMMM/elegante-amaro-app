import PressableScale from '@/src/components/ui/PressableScale';
import Price from '@/src/components/ui/Price';
import { theme } from '@/src/theme';
import { Item } from '@/src/types';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  item: Item;
  onPress: () => void;
}

/** Carte produit pour la grille de la Carte. */
export default function ItemCard({ item, onPress }: Props) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.96} containerStyle={styles.shell} style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} contentFit="cover" transition={250} />
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.footer}>
          <Price value={item.price} size={20} animate={false} />
          <View style={styles.plus}>
            <Plus size={16} color={theme.colors.espresso} strokeWidth={2.5} />
          </View>
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    ...theme.shadows.card,
  },
  imageWrap: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 138,
    backgroundColor: theme.colors.surfaceAlt,
  },
  body: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  name: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 15,
    lineHeight: 19,
    color: theme.colors.espresso,
    minHeight: 38,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  plus: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
});
