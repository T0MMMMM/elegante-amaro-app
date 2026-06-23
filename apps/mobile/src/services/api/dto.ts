import type {
  Category,
  Command,
  CommandItem,
  CommandType,
  Item,
  ItemItemOption,
  ItemOption,
  StateCommand,
  Table,
  User,
} from '@elegante-amaro-app/shared/types';

/**
 * Formes exactes renvoyées par l'API (snake_case, décimaux en string).
 * Dérivées des types DB partagés (@elegante-amaro-app/shared/types) :
 * on ne fait qu'assouplir les décimaux (DECIMAL → string|number) et ajouter
 * les associations Sequelize imbriquées. Ne pas utiliser hors des mappers.
 */

export type CategoryDTO = Category;

export interface ItemOptionDTO extends Omit<ItemOption, 'extra_price'> {
  extra_price: string | number;
}

export interface ItemDTO extends Omit<Item, 'price' | 'image' | 'created_at' | 'updated_at'> {
  price: string | number;
  image: string | null;
  description?: string | null;
  Category?: CategoryDTO;
}

export interface ItemItemOptionDTO extends ItemItemOption {
  ItemOption?: ItemOptionDTO;
}

export type CommandTypeDTO = CommandType;

export type TableDTO = Table;

export type StateCommandDTO = StateCommand;

export interface UserDTO extends Omit<User, 'password_hash' | 'fidelity_points' | 'roles'> {
  /** Présent dans GET /users — mot de passe stocké en clair côté API (démo). */
  password_hash?: string | null;
  fidelity_points: number | null;
  roles: string[] | string | null;
}

export interface CommandItemDTO extends Omit<CommandItem, 'unit_price' | 'line_total'> {
  unit_price: string | number;
  line_total: string | number;
  Item?: { id: number; name: string; price: string | number };
}

export interface CommandDTO
  extends Omit<Command, 'total_price' | 'tva_rate' | 'table_id' | 'created_at' | 'updated_at'> {
  total_price: string | number;
  tva_rate: string | number;
  table_id: number | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  CommandType?: CommandTypeDTO;
  StateCommand?: StateCommandDTO;
  Table?: TableDTO;
  CommandItems?: CommandItemDTO[];
}
