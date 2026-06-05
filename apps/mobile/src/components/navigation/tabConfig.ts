import { Coffee, Home, LucideIcon, ShoppingBag, User } from 'lucide-react-native';

/** Configuration des onglets (libellé + icône Lucide), indexée par nom de route. */
export const TAB_CONFIG: Record<string, { label: string; icon: LucideIcon }> = {
  accueil: { label: 'Accueil', icon: Home },
  carte: { label: 'Carte', icon: Coffee },
  commande: { label: 'Commande', icon: ShoppingBag },
  profil: { label: 'Profil', icon: User },
};

/** Ordre d'affichage des onglets. */
export const TAB_ORDER = ['accueil', 'carte', 'commande', 'profil'];
