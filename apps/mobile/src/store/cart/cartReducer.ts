import { Item, ItemOption, Size, SIZE_MULT } from '@/src/types';
import { CartAction, CartLine, CartState } from './cart.types';

export const initialCartState: CartState = {
  lines: [],
  typeId: 1, // sur place par défaut
  tableId: undefined,
};

/**
 * Prix unitaire = (prix de base × multiplicateur de taille) + somme des extras.
 * La taille n'a d'effet que sur les boissons ; pour les autres articles,
 * la taille reste « moyen » (multiplicateur 1), comme sur le backoffice.
 */
export function unitPrice(item: Item, options: ItemOption[], size: Size = 'moyen'): number {
  return item.price * SIZE_MULT[size] + options.reduce((sum, o) => sum + o.extraPrice, 0);
}

/** Signature stable d'une ligne (item + taille + options triées). */
function lineSignature(itemId: number, size: Size, options: ItemOption[]): string {
  const opt = options
    .map((o) => o.id)
    .sort((a, b) => a - b)
    .join('.');
  return `${itemId}-${size}-${opt}`;
}

function buildLine(
  item: Item,
  size: Size,
  options: ItemOption[],
  quantity: number,
): CartLine {
  return {
    id: lineSignature(item.id, size, options),
    item,
    size,
    options,
    quantity,
    lineTotal: unitPrice(item, options, size) * quantity,
  };
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_LINE': {
      const { item, size, options, quantity } = action.payload;
      const id = lineSignature(item.id, size, options);
      const existing = state.lines.find((l) => l.id === id);

      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.id === id
              ? buildLine(item, size, options, l.quantity + quantity)
              : l,
          ),
        };
      }
      return {
        ...state,
        lines: [...state.lines, buildLine(item, size, options, quantity)],
      };
    }

    case 'UPDATE_QTY': {
      const { lineId, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.id !== lineId) };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === lineId
            ? buildLine(l.item, l.size, l.options, quantity)
            : l,
        ),
      };
    }

    case 'REMOVE_LINE':
      return {
        ...state,
        lines: state.lines.filter((l) => l.id !== action.payload.lineId),
      };

    case 'SET_TYPE':
      return {
        ...state,
        typeId: action.payload.typeId,
        // table pertinente seulement « sur place »
        tableId: action.payload.typeId === 1 ? state.tableId : undefined,
      };

    case 'SET_TABLE':
      return { ...state, tableId: action.payload.tableId };

    case 'CLEAR':
      return { ...initialCartState };

    default:
      return state;
  }
}
