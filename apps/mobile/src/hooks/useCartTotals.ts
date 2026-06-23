import { config } from '@/src/constants/config';
import { useCart } from '@/src/store/cart/CartContext';
import { useMemo } from 'react';

export interface CartTotals {
  /** Total TTC (les prix affichés sont TTC). */
  total: number;
  /** Montant de TVA inclus dans le total. */
  tvaAmount: number;
  /** Montant hors taxes. */
  subtotalHt: number;
  tvaRate: number;
}

/** Dérive les totaux du panier (TTC, dont TVA). */
export function useCartTotals(): CartTotals {
  const { lines } = useCart();
  const tvaRate = config.defaultTvaRate;

  return useMemo(() => {
    const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const subtotalHt = total / (1 + tvaRate);
    const tvaAmount = total - subtotalHt;
    return { total, tvaAmount, subtotalHt, tvaRate };
  }, [lines, tvaRate]);
}
