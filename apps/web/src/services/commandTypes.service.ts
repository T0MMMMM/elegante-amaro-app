import type { CommandType } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const commandTypesService = {
  getAll:  ()                                    => http.get<CommandType[]>('/commands-types'),
  getById: (id: number)                          => http.get<CommandType>(`/commands-types/${id}`),
  create:  (data: Omit<CommandType, 'id'>)        => http.post<CommandType>('/commands-types', data),
  update:  (id: number, data: Partial<CommandType>) => http.put<CommandType>(`/commands-types/${id}`, data),
  remove:  (id: number)                          => http.delete(`/commands-types/${id}`),
}
