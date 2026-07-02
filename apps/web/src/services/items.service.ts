import type { Item } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const itemsService = {
  getAll:  (includeDeleted = false)         => http.get<Item[]>(`/items${includeDeleted ? '?includeDeleted=true' : ''}`),
  getById: (id: number)                     => http.get<Item>(`/items/${id}`),
  create:  (data: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => http.post<Item>('/items', data),
  update:  (id: number, data: Partial<Item>) => http.put<Item>(`/items/${id}`, data),
  remove:  (id: number)                     => http.delete(`/items/${id}`),
}
