import PressableScale from '@/src/components/ui/PressableScale';
import { theme } from '@/src/theme';
import { CommandType } from '@/src/types';
import { LucideIcon, ShoppingBag, Utensils } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

/** Icône par type de commande (1 = sur place, 2 = à emporter). */
const TYPE_ICONS: Record<number, LucideIcon> = {
  1: Utensils,
  2: ShoppingBag,
};

interface Props {
  types: CommandType[];
  selectedId: number;
  onSelect: (id: number) => void;
}

/** Choix du type de commande avec icônes : sur place / à emporter. */
export default function OrderTypeSelector({ types, selectedId, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {types.map((t) => (
        <TypeSegment
          key={t.id}
          type={t}
          selected={t.id === selectedId}
          onPress={() => onSelect(t.id)}
        />
      ))}
    </View>
  );
}

function TypeSegment({
  type,
  selected,
  onPress,
}: {
  type: CommandType;
  selected: boolean;
  onPress: () => void;
}) {
  const Icon = TYPE_ICONS[type.id] ?? Utensils;
  const color = selected ? theme.colors.cream : theme.colors.textMuted;
  const pop = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pop, {
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
      speed: 26,
      bounciness: 14,
    }).start();
  }, [selected, pop]);

  const iconScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });

  return (
    <PressableScale
      onPress={onPress}
      containerStyle={styles.flex}
      style={[styles.segment, selected ? styles.selected : styles.idle]}
    >
      <Animated.View style={{ transform: [{ scale: iconScale }] }}>
        <Icon size={22} color={color} strokeWidth={2} />
      </Animated.View>
      <Text style={[styles.label, { color }]}>{type.name}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  flex: {
    flex: 1,
  },
  segment: {
    height: 76,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1.5,
  },
  idle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  selected: {
    backgroundColor: theme.colors.espresso,
    borderColor: theme.colors.espresso,
  },
  label: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 13,
    textAlign: 'center',
  },
});
