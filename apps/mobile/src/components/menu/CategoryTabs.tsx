import Chip from '@/src/components/ui/Chip';
import { Category } from '@/src/types';
import { theme } from '@/src/theme';
import { ScrollView, StyleSheet } from 'react-native';

interface Props {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

/** Onglets de catégories horizontaux (« Tout » + catégories). */
export default function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Chip label="Tout" selected={selectedId === null} onPress={() => onSelect(null)} />
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.name}
          selected={selectedId === cat.id}
          onPress={() => onSelect(cat.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
  },
});
