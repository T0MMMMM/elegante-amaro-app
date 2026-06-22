import {
  CafeTable,
  Category,
  CommandState,
  CommandType,
  Item,
  ItemOption,
  OngoingOrder,
  OrderSummary,
  User,
} from '@/src/types';
import {
  CategoryDTO,
  CommandDTO,
  CommandTypeDTO,
  ItemDTO,
  ItemOptionDTO,
  StateCommandDTO,
  TableDTO,
  UserDTO,
} from './dto';

/** Décimaux renvoyés en string par l'API (DECIMAL) → number. */
const num = (v: string | number | null | undefined): number =>
  v == null ? 0 : typeof v === 'number' ? v : parseFloat(v) || 0;

export const mapCategory = (d: CategoryDTO): Category => ({ id: d.id, name: d.name });

export const mapItem = (d: ItemDTO): Item => ({
  id: d.id,
  name: d.name,
  slug: d.slug,
  price: num(d.price),
  image: d.image ?? '',
  categoryId: d.category_id,
  description: d.description ?? '',
  // Champs absents du schéma SQL — dérivés/par défaut côté app :
  optionIds: [],
  model3d: undefined, // CoffeeStage3D retombe sur COFFEE_MODEL
  featured: false,
});

export const mapItemOption = (d: ItemOptionDTO): ItemOption => ({
  id: d.id,
  name: d.name,
  extraPrice: num(d.extra_price),
});

export const mapCommandType = (d: CommandTypeDTO): CommandType => ({ id: d.id, name: d.name });
export const mapTable = (d: TableDTO): CafeTable => ({ id: d.id, numero: d.numero });
export const mapState = (d: StateCommandDTO): CommandState => ({ id: d.id, state: d.state });

export const mapUser = (d: UserDTO): User => ({
  id: d.id,
  name: d.name,
  email: d.email,
  fidelityPoints: d.fidelity_points ?? 0,
  roles: Array.isArray(d.roles) ? d.roles : typeof d.roles === 'string' ? [d.roles] : [],
});

// --- Commandes ---

const ONGOING_STATES = ['en attente', 'en préparation', 'en preparation', 'prête', 'prete'];
const STEP_BY_STATE: Record<string, number> = {
  'en attente': 1,
  'en préparation': 2,
  'en preparation': 2,
  'prête': 3,
  'prete': 3,
};

/** Une commande est « en cours » si son état n'est ni servie ni annulée. */
export const isOngoing = (d: CommandDTO): boolean =>
  ONGOING_STATES.includes((d.StateCommand?.state ?? '').toLowerCase());

const dateOf = (d: CommandDTO): Date => new Date(d.created_at ?? d.createdAt ?? Date.now());

const formatDate = (date: Date): string =>
  date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const formatDateTime = (date: Date): string =>
  date.toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

const itemCountOf = (d: CommandDTO): number =>
  (d.CommandItems ?? []).reduce((sum, it) => sum + (it.quantity ?? 0), 0);

export const mapOngoingOrder = (d: CommandDTO): OngoingOrder => {
  const state = d.StateCommand?.state ?? 'En attente';
  return {
    id: d.id,
    number: `EA-${d.id}`,
    stateLabel: state,
    stateStep: STEP_BY_STATE[state.toLowerCase()] ?? 1,
    typeLabel: d.CommandType?.name ?? '',
    tableNumber: d.Table?.numero,
    total: num(d.total_price),
    placedAtLabel: formatDateTime(dateOf(d)),
    createdAt: dateOf(d).toISOString(),
    items: (d.CommandItems ?? []).map((it) => ({
      name: it.Item?.name ?? 'Article',
      quantity: it.quantity ?? 1,
    })),
  };
};

export const mapOrderSummary = (d: CommandDTO): OrderSummary => ({
  id: d.id,
  number: `EA-${d.id}`,
  dateLabel: formatDate(dateOf(d)),
  stateLabel: d.StateCommand?.state ?? '',
  total: num(d.total_price),
  itemCount: itemCountOf(d),
  createdAt: dateOf(d).toISOString(),
});
