import { CATEGORIES } from '@/src/data/categories.mock';
import { ITEMS } from '@/src/data/items.mock';
import { ITEM_OPTIONS } from '@/src/data/options.mock';
import { Category, Item, ItemOption } from '@/src/types';

/**
 * Couche d'accès au menu. Aujourd'hui : données mock locales.
 * Pour brancher l'API : remplace chaque corps par un `fetch(...)` — la signature ne change pas.
 */
export const menuService = {
  async getCategories(): Promise<Category[]> {
    return CATEGORIES;
  },

  async getItems(): Promise<Item[]> {
    return ITEMS;
  },

  async getFeaturedItems(): Promise<Item[]> {
    return ITEMS.filter((item) => item.featured);
  },

  async getItemsByCategory(categoryId: number): Promise<Item[]> {
    return ITEMS.filter((item) => item.categoryId === categoryId);
  },

  async getItemBySlug(slug: string): Promise<Item | undefined> {
    return ITEMS.find((item) => item.slug === slug);
  },

  async getOptionsForItem(itemId: number): Promise<ItemOption[]> {
    const item = ITEMS.find((i) => i.id === itemId);
    if (!item) return [];
    return ITEM_OPTIONS.filter((opt) => item.optionIds.includes(opt.id));
  },
};
