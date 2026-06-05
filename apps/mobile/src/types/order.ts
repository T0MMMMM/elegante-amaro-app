import { Item, ItemOption, Size } from './item';

/** Miroir TS des tables commands / commands_items / commands_types / state_commands / tables. */

/** Table `commands_types` (sur place / à emporter / livraison). */
export interface CommandType {
  id: number;
  name: string;
}

/** Table `state_commands`. */
export interface CommandState {
  id: number;
  state: string;
}

/** Table `tables`. */
export interface CafeTable {
  id: number;
  numero: number;
}

/** Table `commands_items` (+ options choisies via commands_items_options). */
export interface CommandItem {
  id: number;
  item: Item;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  size: Size;
  options: ItemOption[];
}

/** Résumé d'une commande passée (historique « Mes commandes »). */
export interface OrderSummary {
  id: number;
  number: string;
  dateLabel: string;
  stateLabel: string;
  total: number;
  itemCount: number;
}

/** Ligne récap d'une commande en cours. */
export interface OngoingOrderItem {
  name: string;
  quantity: number;
}

/** Commande en cours (affichage détaillé avec suivi de statut). */
export interface OngoingOrder {
  id: number;
  number: string;
  stateLabel: string;
  /** Étape courante : 1 = En attente, 2 = En préparation, 3 = Prête. */
  stateStep: number;
  typeLabel: string;
  tableNumber?: number;
  total: number;
  placedAtLabel: string;
  items: OngoingOrderItem[];
}

/** Table `commands`. */
export interface Command {
  id: number;
  userId: number;
  typeId: number;
  stateCommandId: number;
  totalPrice: number;
  tvaRate: number;
  tableId?: number;
  items: CommandItem[];
  createdAt: string;
  updatedAt: string;
}
