import * as Haptics from 'expo-haptics';

/** Exécute un retour haptique en ignorant les plateformes non supportées (web, émulateur). */
function safe(run: () => Promise<unknown> | void) {
  try {
    const result = run();
    if (result && typeof (result as Promise<unknown>).catch === 'function') {
      (result as Promise<unknown>).catch(() => {});
    }
  } catch {
    // Haptique indisponible : on ignore silencieusement.
  }
}

/**
 * Retours haptiques de l'app — sobres et choisis (le luxe se ressent, il ne vibre pas partout).
 * - `selection` : changement de choix (taille, extra, catégorie, quantité)
 * - `light`/`medium` : actions (ajout panier, confirmation)
 * - `success`/`error` : issue d'un paiement
 */
export const haptics = {
  selection: () => safe(() => Haptics.selectionAsync()),
  light: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  medium: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  error: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
