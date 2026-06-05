import { User } from '@/src/types';

/** Données mock — miroir de la table `users` (sans password_hash). */
export const CURRENT_USER: User = {
  id: 1,
  name: 'Tom Fuster',
  email: 'tom.fuster34000@gmail.com',
  fidelityPoints: 68,
  roles: ['customer'],
};
