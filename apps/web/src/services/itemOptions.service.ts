import type { ItemOption } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const itemOptionsService = {
  getAll:  ()                                    => http.get<ItemOption[]>('/item-options'),
  getById: (id: number)                          => http.get<ItemOption>(`/item-options/${id}`),
  create:  (data: Omit<ItemOption, 'id'>)        => http.post<ItemOption>('/item-options', data),
  update:  (id: number, data: Partial<ItemOption>) => http.put<ItemOption>(`/item-options/${id}`, data),
  remove:  (id: number)                          => http.delete(`/item-options/${id}`),
}
