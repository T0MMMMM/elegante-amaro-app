import AddToCartBar from '@/src/components/item/AddToCartBar';
import OptionToggle from '@/src/components/item/OptionToggle';
import SizeSelector from '@/src/components/item/SizeSelector';
import FadeInView from '@/src/components/ui/FadeInView';
import Price from '@/src/components/ui/Price';
import QuantityStepper from '@/src/components/ui/QuantityStepper';
import ScreenLoader from '@/src/components/ui/ScreenLoader';
import { NO_IMAGE } from '@/src/constants/assets';
import { menuService } from '@/src/services/menuService';
import { useCart } from '@/src/store/cart/CartContext';
import { unitPrice } from '@/src/store/cart/cartReducer';
import { theme } from '@/src/theme';
import { Item, ItemOption, Size } from '@/src/types';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ItemDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addLine } = useCart();

  const [item, setItem] = useState<Item | null>(null);
  const [options, setOptions] = useState<ItemOption[]>([]);
  const [size, setSize] = useState<Size>('moyen');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;
    menuService.getItemBySlug(slug).then((found) => {
      if (found) {
        setItem(found);
        menuService.getOptionsForItem(found.id).then(setOptions);
      }
    });
  }, [slug]);

  const selectedOptions = useMemo(
    () => options.filter((o) => selectedIds.includes(o.id)),
    [options, selectedIds],
  );

  const total = useMemo(
    () => (item ? unitPrice(item, selectedOptions) * quantity : 0),
    [item, selectedOptions, quantity],
  );

  if (!item) return <ScreenLoader />;

  const toggleOption = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleAdd = () => {
    addLine(item, size, selectedOptions, quantity);
    router.back();
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={item.image || NO_IMAGE} style={styles.image} contentFit="cover" transition={250} />
          <Pressable
            onPress={() => router.back()}
            style={[styles.back, { top: insets.top + theme.spacing.sm }]}
            hitSlop={8}
          >
            <ChevronLeft size={24} color={theme.colors.espresso} strokeWidth={2.4} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <FadeInView delay={60}>
            <Text style={styles.overline}>Notre création</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Price value={item.price} size={28} animate={false} />
            <Text style={styles.description}>{item.description}</Text>
          </FadeInView>

          <FadeInView delay={140} style={styles.section}>
            <Text style={styles.sectionTitle}>Taille</Text>
            <SizeSelector value={size} onChange={setSize} />
          </FadeInView>

          {options.length > 0 ? (
            <FadeInView delay={200} style={styles.section}>
              <Text style={styles.sectionTitle}>Personnalisez</Text>
              <View>
                {options.map((opt) => (
                  <OptionToggle
                    key={opt.id}
                    option={opt}
                    selected={selectedIds.includes(opt.id)}
                    onToggle={() => toggleOption(opt.id)}
                  />
                ))}
              </View>
            </FadeInView>
          ) : null}

          <FadeInView delay={260} style={[styles.section, styles.qtyRow]}>
            <Text style={styles.sectionTitle}>Quantité</Text>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </FadeInView>
        </View>
      </ScrollView>

      <AddToCartBar total={total} onAdd={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    paddingBottom: theme.spacing.xxl,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: theme.colors.surfaceAlt,
  },
  back: {
    position: 'absolute',
    left: theme.spacing.xl,
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  body: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  overline: {
    ...theme.typography.label,
    color: theme.colors.goldDark,
    marginBottom: theme.spacing.xs,
  },
  name: {
    ...theme.typography.h1,
    fontSize: 34,
    color: theme.colors.espresso,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.fontFamily.display,
    fontSize: 20,
    letterSpacing: 0.5,
    color: theme.colors.espresso,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
