import { Item } from '@/src/types';
import { theme } from '@/src/theme';
import { FlatList, StyleSheet, View } from 'react-native';
import ItemCard from './ItemCard';

interface Props {
  items: Item[];
  onPressItem: (item: Item) => void;
  ListHeaderComponent?: React.ReactElement;
}

/** Grille 2 colonnes de cartes produit. */
export default function ItemGrid({ items, onPressItem, ListHeaderComponent }: Props) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <ItemCard item={item} onPress={() => onPressItem(item)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.huge,
    gap: theme.spacing.lg,
  },
  row: {
    gap: theme.spacing.lg,
  },
  cell: {
    flex: 1,
  },
});
