import { Size } from '@/src/types';

/**
 * Formes exactes renvoyées par l'API (snake_case, décimaux en string).
 * Ne pas utiliser hors des mappers.
 */

export interface CategoryDTO {
  id: number;
  name: string;
}

export interface ItemOptionDTO {
  id: number;
  name: string;
  extra_price: string | number;
}

export interface ItemDTO {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  image: string | null;
  category_id: number;
  description?: string | null;
  Category?: CategoryDTO;
}

export interface ItemItemOptionDTO {
  id: number;
  item_id: number;
  item_option_id: number;
  ItemOption?: ItemOptionDTO;
}

export interface CommandTypeDTO {
  id: number;
  name: string;
}

export interface TableDTO {
  id: number;
  numero: number;
}

export interface StateCommandDTO {
  id: number;
  state: string;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  fidelity_points: number | null;
  roles: string[] | string | null;
}

export interface CommandItemDTO {
  id: number;
  item_id: number;
  command_id: number;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
  size: Size;
  Item?: { id: number; name: string; price: string | number };
}

export interface CommandDTO {
  id: number;
  user_id: number;
  type_id: number;
  state_command_id: number;
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
