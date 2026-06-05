import { config } from '@/src/constants/config';
import { ONGOING_ORDERS, PAST_ORDERS } from '@/src/data/orders.mock';
import {
  CafeTable,
  Command,
  CommandItem,
  CommandState,
  CommandType,
  OngoingOrder,
  OrderSummary,
} from '@/src/types';

/** Types de commande — miroir `commands_types`. */
const COMMAND_TYPES: CommandType[] = [
  { id: 1, name: 'Sur place' },
  { id: 2, name: 'À emporter' },
];

/** États — miroir `state_commands`. */
const COMMAND_STATES: CommandState[] = [
  { id: 1, state: 'En attente' },
  { id: 2, state: 'En préparation' },
  { id: 3, state: 'Prête' },
  { id: 4, state: 'Servie' },
  { id: 5, state: 'Annulée' },
];

/** Tables — miroir `tables`. */
const TABLES: CafeTable[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  numero: i + 1,
}));

export interface CreateCommandPayload {
  userId: number;
  typeId: number;
  tableId?: number;
  items: CommandItem[];
  totalPrice: number;
}

/**
 * Couche commande. Mock : construit une Command locale en état « En attente ».
 * Pour brancher l'API : remplace `createCommand` par un POST.
 */
export const orderService = {
  async getCommandTypes(): Promise<CommandType[]> {
    return COMMAND_TYPES;
  },

  async getStates(): Promise<CommandState[]> {
    return COMMAND_STATES;
  },

  async getTables(): Promise<CafeTable[]> {
    return TABLES;
  },

  async getOngoingCommands(): Promise<OngoingOrder[]> {
    return ONGOING_ORDERS;
  },

  async getUserCommands(): Promise<OrderSummary[]> {
    return PAST_ORDERS;
  },

  async createCommand(payload: CreateCommandPayload): Promise<Command> {
    const now = new Date().toISOString();
    return {
      id: Math.floor(Math.random() * 100000),
      userId: payload.userId,
      typeId: payload.typeId,
      stateCommandId: 1, // En attente
      totalPrice: payload.totalPrice,
      tvaRate: config.defaultTvaRate,
      tableId: payload.tableId,
      items: payload.items,
      createdAt: now,
      updatedAt: now,
    };
  },
};
