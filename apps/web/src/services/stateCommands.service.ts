import type { StateCommand } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const stateCommandsService = {
  getAll:  (includeDeleted = false)                 => http.get<StateCommand[]>(`/state-commands${includeDeleted ? '?includeDeleted=true' : ''}`),
  getById: (id: number)                             => http.get<StateCommand>(`/state-commands/${id}`),
  create:  (data: Omit<StateCommand, 'id'>)         => http.post<StateCommand>('/state-commands', data),
  update:  (id: number, data: Partial<StateCommand>) => http.put<StateCommand>(`/state-commands/${id}`, data),
  remove:  (id: number)                             => http.delete(`/state-commands/${id}`),
}
