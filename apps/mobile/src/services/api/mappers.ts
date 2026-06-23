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
export const mapState = (d: StateCommandDTO): CommandState => ({
  id: d.id,
  state: d.state,
  position: d.position ?? null,
  color: d.color ?? null,
  visibleOnMobile: d.visible_on_mobile !== false,
  isFinal: !!d.is_final,
});

export const mapUser = (d: UserDTO): User => ({
  id: d.id,
  name: d.name,
  email: d.email,
  fidelityPoints: d.fidelity_points ?? 0,
  roles: Array.isArray(d.roles) ? d.roles : typeof d.roles === 'string' ? [d.roles] : [],
});

// --- Commandes ---

/** Une commande est « en cours » tant que son statut n'est pas marqué final côté backoffice. */
export const isOngoing = (d: CommandDTO): boolean => !d.StateCommand?.is_final;

const dateOf = (d: CommandDTO): Date => new Date(d.created_at ?? d.createdAt ?? Date.now());

const formatDate = (date: Date): string =>
  date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const formatDateTime = (date: Date): string =>
  date.toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

const itemCountOf = (d: CommandDTO): number =>
  (d.CommandItems ?? []).reduce((sum, it) => sum + (it.quantity ?? 0), 0);

/**
 * Mappe une commande en cours.
 * `sequence` est la liste ordonnée (position croissante) des statuts non-finaux
 * visibles sur mobile, configurée depuis le backoffice — elle pilote le tracker
 * de suivi (nombre d'étapes, libellés, étape courante) sans aucun nom en dur.
 */
export const mapOngoingOrder = (d: CommandDTO, sequence: StateCommandDTO[]): OngoingOrder => {
  const stateCommand = d.StateCommand;
  const idx = stateCommand ? sequence.findIndex((s) => s.id === stateCommand.id) : -1;
  return {
    id: d.id,
    number: `EA-${d.id}`,
    stateLabel: stateCommand?.state ?? 'En attente',
    stateColor: stateCommand?.color ?? null,
    steps: sequence.map((s) => s.state),
    stateStep: idx + 1,
    isReady: idx !== -1 && idx === sequence.length - 1,
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
  stateColor: d.StateCommand?.color ?? null,
  total: num(d.total_price),
  itemCount: itemCountOf(d),
  createdAt: dateOf(d).toISOString(),
});
