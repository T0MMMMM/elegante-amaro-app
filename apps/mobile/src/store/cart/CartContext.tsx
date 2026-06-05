import { Item, ItemOption, Size } from '@/src/types';
import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { CartLine } from './cart.types';
import { cartReducer, initialCartState } from './cartReducer';

interface CartContextValue {
  lines: CartLine[];
  typeId: number;
  tableId?: number;
  /** Nombre total d'articles (somme des quantités). */
  itemCount: number;
  addLine: (item: Item, size: Size, options: ItemOption[], quantity: number) => void;
  updateQty: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  setType: (typeId: number) => void;
  setTable: (tableId?: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const addLine = useCallback(
    (item: Item, size: Size, options: ItemOption[], quantity: number) =>
      dispatch({ type: 'ADD_LINE', payload: { item, size, options, quantity } }),
    [],
  );
  const updateQty = useCallback(
    (lineId: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QTY', payload: { lineId, quantity } }),
    [],
  );
  const removeLine = useCallback(
    (lineId: string) => dispatch({ type: 'REMOVE_LINE', payload: { lineId } }),
    [],
  );
  const setType = useCallback(
    (typeId: number) => dispatch({ type: 'SET_TYPE', payload: { typeId } }),
    [],
  );
  const setTable = useCallback(
    (tableId?: number) => dispatch({ type: 'SET_TABLE', payload: { tableId } }),
    [],
  );
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const itemCount = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.quantity, 0),
    [state.lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      typeId: state.typeId,
      tableId: state.tableId,
      itemCount,
      addLine,
      updateQty,
      removeLine,
      setType,
      setTable,
      clear,
    }),
    [state.lines, state.typeId, state.tableId, itemCount, addLine, updateQty, removeLine, setType, setTable, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un <CartProvider>.');
  return ctx;
}
