import type { Table } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const tablesService = {
  getAll:  (includeDeleted = false)          => http.get<Table[]>(`/tables${includeDeleted ? '?includeDeleted=true' : ''}`),
  getById: (id: number)                      => http.get<Table>(`/tables/${id}`),
  create:  (data: Omit<Table, 'id'>)         => http.post<Table>('/tables', data),
  update:  (id: number, data: Partial<Table>) => http.put<Table>(`/tables/${id}`, data),
  remove:  (id: number)                      => http.delete(`/tables/${id}`),
}
