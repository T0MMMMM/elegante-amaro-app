/** Salutation selon l'heure — touche « concierge » qui reconnaît le moment de la journée. */
export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 6) return 'Belle nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bel après-midi';
  return 'Bonsoir';
}
