/** Miroir TS du schéma SQL (tables items / categories / item_options). */

/** Tailles de boisson (commands_items.size ENUM). */
export type Size = 'petit' | 'moyen' | 'grand';

export const SIZES: { value: Size; label: string }[] = [
  { value: 'petit', label: 'Petit' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'grand', label: 'Grand' },
];

/**
 * Multiplicateur de prix selon la taille du gobelet.
 * Aligné sur le backoffice (« moyen » = prix de référence).
 */
export const SIZE_MULT: Record<Size, number> = { petit: 0.85, moyen: 1, grand: 1.2 };

/** Table `categories`. */
export interface Category {
  id: number;
  name: string;
}

/** Table `item_options` (extras facturés via extra_price). */
export interface ItemOption {
  id: number;
  name: string;
  extraPrice: number;
}

/** Table `items` (+ relation items_item_options et champ 3D applicatif). */
export interface Item {
  id: number;
  name: string;
  slug: string;
  price: number;
  /** Image distante ou locale (asset). Mock : require(...) ou URL. */
  image: string | number;
  categoryId: number;
  /** Description produit (affichage ; non présent dans le schéma SQL). */
  description: string;
  /** Modèle 3D .glb (require). Absent -> fallback coffee.glb. */
  model3d?: number;
  /** IDs des options disponibles (items_item_options). */
  optionIds: number[];
  /** Mis en avant sur l'Accueil. */
  featured?: boolean;
}
