import type { User } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const usersService = {
  getAll:  ()                               => http.get<User[]>('/users'),
  create:  (data: Omit<User, 'id'>)         => http.post<User>('/users', data),
  update:  (id: number, data: Partial<User>) => http.put<User>(`/users/${id}`, data),
  remove:  (id: number)                     => http.delete(`/users/${id}`),
}
