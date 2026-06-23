import { Item, ItemOption, Size } from './item';

/** Miroir TS des tables commands / commands_items / commands_types / state_commands / tables. */

/** Table `commands_types` (sur place / à emporter / livraison). */
export interface CommandType {
  id: number;
  name: string;
}

/** Table `state_commands`. Statuts entièrement personnalisables depuis le backoffice. */
export interface CommandState {
  id: number;
  state: string;
  position: number | null;
  color: string | null;
  /** false si l'admin a masqué ce statut côté mobile. */
  visibleOnMobile: boolean;
  /** true pour un statut qui clôt la commande (ex. livrée, annulée). */
  isFinal: boolean;
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
  /** Couleur configurée par l'admin pour ce statut (backoffice) ; null si non définie. */
  stateColor: string | null;
  total: number;
  itemCount: number;
  /** ISO — pour trier du plus récent au plus ancien. */
  createdAt: string;
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
  /** Couleur configurée par l'admin pour ce statut (backoffice) ; null si non définie. */
  stateColor: string | null;
  /** Libellés des statuts non-finaux visibles sur mobile, dans l'ordre du backoffice. */
  steps: string[];
  /** Position (1-based) du statut courant dans `steps` ; 0 si absent de la séquence. */
  stateStep: number;
  /** true si le statut courant est le dernier avant un statut final (ex. "prête"). */
  isReady: boolean;
  typeLabel: string;
  tableNumber?: number;
  total: number;
  placedAtLabel: string;
  /** ISO — pour trier du plus récent au plus ancien. */
  createdAt: string;
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
