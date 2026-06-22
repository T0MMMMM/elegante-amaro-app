import type { ItemItemOption } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const itemsItemOptionsService = {
  getAll: ()                                  => http.get<ItemItemOption[]>('/items-item-options'),
  create: (data: Omit<ItemItemOption, 'id'>) => http.post<ItemItemOption>('/items-item-options', data),
  remove: (id: number)                        => http.delete(`/items-item-options/${id}`),
}
