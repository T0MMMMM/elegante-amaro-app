import Badge from '@/src/components/ui/Badge';
import { useCart } from '@/src/store/cart/CartContext';
import { theme } from '@/src/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_CONFIG } from './tabConfig';

/** Tab bar custom (effet luxe : crème surélevé, onglet actif doré). */
export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        const focused = state.index === index;
        const Icon = config.icon;
        const color = focused ? theme.colors.goldDark : theme.colors.textMuted;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <View style={styles.iconWrap}>
              <Icon size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
              {route.name === 'commande' ? (
                <View style={styles.badge}>
                  <Badge count={itemCount} />
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, { color }]}>{config.label}</Text>
            {focused ? <View style={styles.indicator} /> : <View style={styles.indicatorPlaceholder} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingTop: theme.spacing.md,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    ...theme.shadows.lifted,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
  },
  label: {
    fontFamily: theme.fontFamily.display,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  indicator: {
    width: 18,
    height: 3,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.gold,
  },
  indicatorPlaceholder: {
    height: 3,
  },
});
