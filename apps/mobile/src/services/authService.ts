import { api } from '@/src/services/api/client';
import { UserDTO } from '@/src/services/api/dto';
import { mapUser } from '@/src/services/api/mappers';
import { User } from '@/src/types';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

/**
 * Authentification côté client : l'API n'expose pas d'endpoint d'auth dédié,
 * on s'appuie donc sur le CRUD `/users`. Le mot de passe est comparé/stocké
 * en clair dans `password_hash` (limitation de l'API — projet démo).
 */
export const authService = {
  async login({ email, password }: Credentials): Promise<User> {
    const users = await api.get<UserDTO[]>('/users');
    const target = normalizeEmail(email);
    const match = users.find((u) => (u.email ?? '').toLowerCase() === target);
    if (!match) throw new Error('Aucun compte associé à cet email.');
    if ((match.password_hash ?? '') !== password) {
      throw new Error('Email ou mot de passe incorrect.');
    }
    return mapUser(match);
  },

  async register({ name, email, password }: RegisterPayload): Promise<User> {
    const target = normalizeEmail(email);
    const users = await api.get<UserDTO[]>('/users');
    if (users.some((u) => (u.email ?? '').toLowerCase() === target)) {
      throw new Error('Un compte existe déjà avec cet email.');
    }
    const created = await api.post<UserDTO>('/users', {
      name: name.trim(),
      email: target,
      password_hash: password,
      fidelity_points: 0,
      roles: ['client'],
    });
    return mapUser(created);
  },
};
