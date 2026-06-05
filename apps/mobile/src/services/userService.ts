import { CLIENT_INFO } from '@/src/data/clientInfo.mock';
import { CURRENT_USER } from '@/src/data/user.mock';
import { ClientInfo, User } from '@/src/types';

/**
 * Couche utilisateur. Mock : renvoie l'utilisateur courant local.
 * Pour brancher l'API : remplace par un GET /me.
 */
export const userService = {
  async getCurrentUser(): Promise<User> {
    return CURRENT_USER;
  },

  async getClientInfo(): Promise<ClientInfo> {
    return CLIENT_INFO;
  },

  /** Mock : renvoie les infos telles quelles. Branche un PUT /me ici. */
  async updateClientInfo(info: ClientInfo): Promise<ClientInfo> {
    return info;
  },
};
