/** Config globale de l'app (valeurs par défaut, remplaçables côté API). */
export const config = {
  /**
   * URL de base de l'API. Définis EXPO_PUBLIC_API_URL dans un .env mobile
   * (ex: http://192.168.1.20:3000 — l'IP LAN de ta machine pour un téléphone réel).
   */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  currency: '€',
  /** Taux de TVA par défaut (commands.tva_rate). 10% restauration. */
  defaultTvaRate: 0.1,
  /** Seuil de points pour la prochaine récompense fidélité (affichage Profil). */
  fidelityGoal: 100,
} as const;

/** Formate un prix : 3.5 -> "3,50 €". */
export function formatPrice(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} ${config.currency}`;
}
