import { api } from '@/src/services/api/client';
import { UserDTO } from '@/src/services/api/dto';
import { mapUser } from '@/src/services/api/mappers';
import { ClientInfo, User } from '@/src/types';

/**
 * Utilisateur via l'API. Pas d'endpoint /me ni de PUT /users :
 * on prend le premier utilisateur, et l'édition d'infos reste locale.
 */
export const userService = {
  async getCurrentUser(): Promise<User> {
    const users = await api.get<UserDTO[]>('/users');
    const current = users[0];
    if (!current) throw new Error('Aucun utilisateur disponible.');
    return mapUser(current);
  },

  async getClientInfo(): Promise<ClientInfo> {
    const users = await api.get<UserDTO[]>('/users');
    const u = users[0];
    return {
      name: u?.name ?? '',
      email: u?.email ?? '',
      // Non présents dans la table `users` — à ajouter côté API si besoin :
      phone: '',
      address: '',
      postalCode: '',
      city: '',
    };
  },

  /** Pas de PUT /users dans l'API : mise à jour locale uniquement. */
  async updateClientInfo(info: ClientInfo): Promise<ClientInfo> {
    return info;
  },
};
