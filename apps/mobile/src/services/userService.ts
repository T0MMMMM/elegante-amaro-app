import { api } from '@/src/services/api/client';
import { UserDTO } from '@/src/services/api/dto';
import { mapUser } from '@/src/services/api/mappers';
import { User } from '@/src/types';

export interface ProfileUpdate {
  name: string;
  email: string;
  /** Optionnel — renseigné seulement si l'utilisateur change de mot de passe. */
  password?: string;
}

/** Utilisateurs via l'API (CRUD `/users`). */
export const userService = {
  async getById(id: number): Promise<User> {
    const dto = await api.get<UserDTO>(`/users/${id}`);
    return mapUser(dto);
  },

  /** Met à jour le profil (PUT /users/:id). Le mot de passe n'est envoyé que s'il change. */
  async updateProfile(id: number, data: ProfileUpdate): Promise<User> {
    const body: Record<string, unknown> = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    };
    if (data.password) body.password_hash = data.password;
    const updated = await api.put<UserDTO>(`/users/${id}`, body);
    return mapUser(updated);
  },

  /**
   * Commande invité : retrouve l'utilisateur par email ou en crée un
   * (sans mot de passe) pour rattacher la commande à un `user_id`.
   */
  async upsertGuest(name: string, email: string): Promise<User> {
    const target = email.trim().toLowerCase();
    const users = await api.get<UserDTO[]>('/users');
    const existing = users.find((u) => (u.email ?? '').toLowerCase() === target);
    if (existing) return mapUser(existing);
    const created = await api.post<UserDTO>('/users', {
      name: name.trim(),
      email: target,
      fidelity_points: 0,
      roles: ['client'],
    });
    return mapUser(created);
  },
};
