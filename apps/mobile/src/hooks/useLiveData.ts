import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

interface Options {
  /** Intervalle de rafraîchissement auto pendant que l'écran est visible (ms). */
  pollMs?: number;
  /** Désactive tout chargement (ex. utilisateur non connecté). */
  enabled?: boolean;
}

interface LiveData<T> {
  data: T | null;
  /** true pendant un pull-to-refresh manuel. */
  refreshing: boolean;
  /** À brancher sur `onRefresh` d'un RefreshControl. */
  refresh: () => void;
}

/**
 * Charge des données et les garde fraîches sans reload manuel :
 * - refetch à chaque fois que l'écran reprend le focus,
 * - polling optionnel pendant que l'écran est visible (suivi de commande),
 * - pull-to-refresh via `refresh` / `refreshing`.
 *
 * Approche « pull » volontairement simple (pas de cache global ni de socket).
 */
export function useLiveData<T>(fetcher: () => Promise<T>, options: Options = {}): LiveData<T> {
  const { pollMs, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Toujours appeler la dernière version du fetcher sans relancer l'effet de focus.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async (withSpinner: boolean) => {
    if (withSpinner) setRefreshing(true);
    try {
      setData(await fetcherRef.current());
    } catch {
      // Échec réseau : on conserve les données précédentes.
    } finally {
      if (withSpinner) setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      load(false);
      if (!pollMs) return;
      const id = setInterval(() => load(false), pollMs);
      return () => clearInterval(id);
    }, [enabled, pollMs, load]),
  );

  const refresh = useCallback(() => load(true), [load]);

  return { data, refreshing, refresh };
}
