import { api } from '@/src/services/api/client';
import { CategoryDTO, ItemDTO, ItemItemOptionDTO } from '@/src/services/api/dto';
import { mapCategory, mapItem, mapItemOption } from '@/src/services/api/mappers';
import { Category, Item, ItemOption } from '@/src/types';

/** Nombre d'items mis en avant sur l'Accueil (dérivé : l'API n'a pas de flag « featured »). */
const FEATURED_COUNT = 6;

/**
 * Accès au menu via l'API (categories, items, item-options).
 * Toute la communication HTTP passe par `services/api/client`.
 */
export const menuService = {
  async getCategories(): Promise<Category[]> {
    const data = await api.get<CategoryDTO[]>('/categories');
    return data.map(mapCategory);
  },

  async getItems(): Promise<Item[]> {
    const data = await api.get<ItemDTO[]>('/items');
    return data.map(mapItem);
  },

  async getFeaturedItems(): Promise<Item[]> {
    const items = await menuService.getItems();
    return items.slice(0, FEATURED_COUNT).map((it) => ({ ...it, featured: true }));
  },

  async getItemsByCategory(categoryId: number): Promise<Item[]> {
    const items = await menuService.getItems();
    return items.filter((it) => it.categoryId === categoryId);
  },

  async getItemBySlug(slug: string): Promise<Item | undefined> {
    const items = await menuService.getItems();
    return items.find((it) => it.slug === slug);
  },

  async getOptionsForItem(itemId: number): Promise<ItemOption[]> {
    const links = await api.get<ItemItemOptionDTO[]>('/items-item-options');
    return links
      .filter((l) => l.item_id === itemId && l.ItemOption)
      .map((l) => mapItemOption(l.ItemOption!));
  },
};
