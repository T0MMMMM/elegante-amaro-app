import { config } from '@/src/constants/config';
import { api } from '@/src/services/api/client';
import {
  CommandDTO,
  CommandItemDTO,
  CommandTypeDTO,
  StateCommandDTO,
  TableDTO,
} from '@/src/services/api/dto';
import {
  isOngoing,
  mapCommandType,
  mapOngoingOrder,
  mapOrderSummary,
  mapState,
  mapTable,
} from '@/src/services/api/mappers';
import {
  CafeTable,
  Command,
  CommandItem,
  CommandState,
  CommandType,
  OngoingOrder,
  OrderSummary,
} from '@/src/types';

export interface CreateCommandPayload {
  userId: number;
  typeId: number;
  tableId?: number;
  items: CommandItem[];
  totalPrice: number;
}

/**
 * Commandes via l'API. La création orchestre les 3 endpoints
 * (commands → commands-items → commands-items-options) en interne ;
 * l'écran n'appelle qu'une seule fonction.
 */
export const orderService = {
  async getCommandTypes(): Promise<CommandType[]> {
    const data = await api.get<CommandTypeDTO[]>('/commands-types');
    return data.map(mapCommandType);
  },

  async getStates(): Promise<CommandState[]> {
    const data = await api.get<StateCommandDTO[]>('/state-commands');
    return data.map(mapState);
  },

  async getTables(): Promise<CafeTable[]> {
    const data = await api.get<TableDTO[]>('/tables');
    return data.map(mapTable);
  },

  async getOngoingCommands(): Promise<OngoingOrder[]> {
    const data = await api.get<CommandDTO[]>('/commands');
    return data.filter(isOngoing).map(mapOngoingOrder);
  },

  async getUserCommands(): Promise<OrderSummary[]> {
    const data = await api.get<CommandDTO[]>('/commands');
    return data.filter((d) => !isOngoing(d)).map(mapOrderSummary);
  },

  async createCommand(payload: CreateCommandPayload): Promise<Command> {
    // 1) Trouver l'état « En attente »
    const states = await api.get<StateCommandDTO[]>('/state-commands').catch(() => []);
    const pending = states.find((s) => s.state.toLowerCase().includes('attente'));
    const stateCommandId = pending?.id ?? states[0]?.id ?? 1;

    // 2) Créer la commande
    const created = await api.post<CommandDTO>('/commands', {
      user_id: payload.userId,
      type_id: payload.typeId,
      state_command_id: stateCommandId,
      total_price: payload.totalPrice,
      tva_rate: config.defaultTvaRate,
      table_id: payload.tableId ?? null,
    });

    // 3) Créer chaque ligne, puis ses options
    for (const line of payload.items) {
      const unitPrice = line.quantity > 0 ? line.lineTotal / line.quantity : line.unitPrice;
      const createdItem = await api.post<CommandItemDTO>('/commands-items', {
        item_id: line.item.id,
        command_id: created.id,
        quantity: line.quantity,
        unit_price: unitPrice,
        line_total: line.lineTotal,
        size: line.size,
      });

      for (const opt of line.options) {
        await api.post('/commands-items-options', {
          commands_items_id: createdItem.id,
          item_options_id: opt.id,
          extra_price: opt.extraPrice,
        });
      }
    }

    return {
      id: created.id,
      userId: payload.userId,
      typeId: payload.typeId,
      stateCommandId,
      totalPrice: payload.totalPrice,
      tvaRate: config.defaultTvaRate,
      tableId: payload.tableId,
      items: payload.items,
      createdAt: created.created_at ?? created.createdAt ?? new Date().toISOString(),
      updatedAt: created.updated_at ?? created.updatedAt ?? new Date().toISOString(),
    };
  },
};
