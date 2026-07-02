import type { Command } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const commandsService = {
  getAll:  (includeDeleted = false)                                    => http.get<Command[]>(`/commands${includeDeleted ? '?includeDeleted=true' : ''}`),
  getById: (id: number)                                                => http.get<Command>(`/commands/${id}`),
  create:  (data: Omit<Command, 'id' | 'created_at' | 'updated_at' | 'table_id'> & { table_id: number | null }) => http.post<Command>('/commands', data),
  update:  (id: number, data: Partial<Command>)                        => http.put<Command>(`/commands/${id}`, data),
  remove:  (id: number)                                                => http.delete(`/commands/${id}`),
}
