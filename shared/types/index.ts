// ─── Users ───────────────────────────────────────────────────────────────────

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  fidelity_points: number
  roles: string[]
}

// ─── Categories ──────────────────────────────────────────────────────────────

export interface Category {
  id: number
  name: string
}

// ─── Items ───────────────────────────────────────────────────────────────────

export interface Item {
  id: number
  name: string
  slug: string
  price: number
  image: string
  category_id: number
}

// ─── Item Options ─────────────────────────────────────────────────────────────

export interface ItemOption {
  id: number
  name: string
  extra_price: number
}

/** Junction table: items ↔ item_options */
export interface ItemItemOption {
  id: number
  item_id: number
  item_option_id: number
}

// ─── Tables ───────────────────────────────────────────────────────────────────

export interface Table {
  id: number
  numero: number
}

// ─── Command States & Types ───────────────────────────────────────────────────

export interface StateCommand {
  id: number
  state: string
}

export interface CommandType {
  id: number
  name: string
}

// ─── Commands ─────────────────────────────────────────────────────────────────

export interface Command {
  id: number
  user_id: number
  type_id: number
  state_command_id: number
  total_price: number
  created_at: string
  updated_at: string
  tva_rate: number
  table_id: number
}

export type CommandSize = 'petit' | 'moyen' | 'grand'

export interface CommandItem {
  id: number
  item_id: number
  command_id: number
  quantity: number
  unit_price: number
  line_total: number
  size: CommandSize
}

/** Options applied to a specific command line item */
export interface CommandItemOption {
  id: number
  commands_items_id: number
  item_options_id: number
  extra_price: number
}
