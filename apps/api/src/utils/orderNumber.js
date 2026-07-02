/**
 * Numéro de commande lisible et déterministe, dérivé de l'identifiant.
 * Format : 3 lettres + 3 chiffres (ex. "AAA044"). Doit rester identique à
 * l'implémentation partagée `shared/utils` utilisée par le web et le mobile.
 */
export function formatOrderNumber(id) {
  const n = Math.max(1, Math.floor(Number(id) || 0));
  const PER_BLOCK = 999;
  const seq = ((n - 1) % PER_BLOCK) + 1; // 1 → 999
  let block = Math.floor((n - 1) / PER_BLOCK); // 0 → 26^3 - 1

  let letters = "";
  for (let i = 0; i < 3; i++) {
    letters = String.fromCharCode(65 + (block % 26)) + letters;
    block = Math.floor(block / 26);
  }

  return `${letters}${String(seq).padStart(3, "0")}`;
}
