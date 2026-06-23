import CategoryTabs from '@/src/components/menu/CategoryTabs';
import ItemGrid from '@/src/components/menu/ItemGrid';
import ScreenContainer from '@/src/components/ui/ScreenContainer';
import SectionHeader from '@/src/components/ui/SectionHeader';
import { useLiveData } from '@/src/hooks/useLiveData';
import { menuService } from '@/src/services/menuService';
import { theme } from '@/src/theme';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function CarteScreen() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const { data: categories } = useLiveData(() => menuService.getCategories());
  const { data: items, refreshing, refresh } = useLiveData(() => menuService.getItems());

  const filtered = useMemo(() => {
    return (items ?? []).filter((item) => {
      const matchCat = selectedCat === null || item.categoryId === selectedCat;
      const matchQuery = item.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchCat && matchQuery;
    });
  }, [items, selectedCat, query]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <SectionHeader overline="Notre sélection" title="La Carte" />
        <View style={styles.search}>
          <Search size={18} color={theme.colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher une boisson…"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.categories}>
        <CategoryTabs
          categories={categories ?? []}
          selectedId={selectedCat}
          onSelect={setSelectedCat}
        />
      </View>

      <ItemGrid
        items={filtered}
        onPressItem={(item) => router.push(`/item/${item.slug}`)}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.lg,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  input: {
    flex: 1,
    fontFamily: theme.fontFamily.body,
    fontSize: 14,
    color: theme.colors.espresso,
  },
  categories: {
    paddingBottom: theme.spacing.md,
  },
});
