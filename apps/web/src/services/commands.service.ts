import type { Command } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const commandsService = {
  getAll:  ()                                                          => http.get<Command[]>('/commands'),
  getById: (id: number)                                                => http.get<Command>(`/commands/${id}`),
  create:  (data: Omit<Command, 'id' | 'created_at' | 'updated_at'>)  => http.post<Command>('/commands', data),
  update:  (id: number, data: Partial<Command>)                        => http.put<Command>(`/commands/${id}`, data),
  remove:  (id: number)                                                => http.delete(`/commands/${id}`),
}
