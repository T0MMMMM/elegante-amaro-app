import { CommandType } from '@/src/types';
import { theme } from '@/src/theme';
import { LucideIcon, ShoppingBag, Utensils } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
      {types.map((t) => {
        const selected = t.id === selectedId;
        const Icon = TYPE_ICONS[t.id] ?? Utensils;
        const color = selected ? theme.colors.cream : theme.colors.textMuted;
        return (
          <Pressable
            key={t.id}
            onPress={() => onSelect(t.id)}
            style={({ pressed }) => [
              styles.segment,
              selected ? styles.selected : styles.idle,
              pressed && styles.pressed,
            ]}
          >
            <Icon size={22} color={color} strokeWidth={2} />
            <Text style={[styles.label, { color }]}>{t.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  segment: {
    flex: 1,
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
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 13,
    textAlign: 'center',
  },
});
