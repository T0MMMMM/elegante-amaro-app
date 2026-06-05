import { Item, ItemOption, Size } from '@/src/types';

/** Une ligne de panier — miroir de `commands_items` (+ options choisies). */
export interface CartLine {
  /** Signature unique : item + taille + options. */
  id: string;
  item: Item;
  size: Size;
  options: ItemOption[];
  quantity: number;
  /** unitPrice * quantity (unitPrice = item.price + Σ options.extraPrice). */
  lineTotal: number;
}

export interface CartState {
  lines: CartLine[];
  /** commands_types : 1=sur place, 2=à emporter, 3=livraison. */
  typeId: number;
  /** tables.id (seulement si sur place). */
  tableId?: number;
}

export type CartAction =
  | { type: 'ADD_LINE'; payload: { item: Item; size: Size; options: ItemOption[]; quantity: number } }
  | { type: 'UPDATE_QTY'; payload: { lineId: string; quantity: number } }
  | { type: 'REMOVE_LINE'; payload: { lineId: string } }
  | { type: 'SET_TYPE'; payload: { typeId: number } }
  | { type: 'SET_TABLE'; payload: { tableId?: number } }
  | { type: 'CLEAR' };
