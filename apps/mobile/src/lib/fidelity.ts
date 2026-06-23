/**
 * Fidélité présentée comme un statut de membre (cercle), pas comme des points à dépenser.
 * Les paliers sont dérivés côté app à partir de `fidelity_points` (table users).
 */
export interface FidelityTier {
  name: string;
  min: number;
  /** Privilège associé au palier (exclusivité plutôt que rabais). */
  perk: string;
}

const TIERS: FidelityTier[] = [
  { name: 'Découverte', min: 0, perk: 'Bienvenue dans la maison' },
  { name: 'Initié', min: 50, perk: 'Accès à nos éditions saisonnières' },
  { name: 'Habitué', min: 150, perk: 'Une boisson signature vous est offerte' },
  { name: 'Cercle Privé', min: 350, perk: 'Accès anticipé & attentions privées' },
];

export interface FidelityStatus {
  tier: FidelityTier;
  /** Palier suivant, ou null si déjà au sommet. */
  next: FidelityTier | null;
  /** Progression 0→1 vers le palier suivant. */
  progress: number;
  /** Points restants avant le palier suivant. */
  toNext: number;
}

export function fidelityStatus(points: number): FidelityStatus {
  let index = 0;
  TIERS.forEach((tier, i) => {
    if (points >= tier.min) index = i;
  });

  const tier = TIERS[index];
  const next = TIERS[index + 1] ?? null;
  if (!next) return { tier, next: null, progress: 1, toNext: 0 };

  const span = next.min - tier.min;
  const progress = Math.min(1, Math.max(0, (points - tier.min) / span));
  return { tier, next, progress, toNext: Math.max(0, next.min - points) };
}
