import type { Item } from '@elegante-amaro-app/shared/types'
import { itemsService } from '../services'

export const getItems    = ()                               => itemsService.getAll()
export const createItem  = (data: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => itemsService.create(data)
export const updateItem  = (id: number, data: Partial<Item>) => itemsService.update(id, data)
export const deleteItem  = (id: number)                     => itemsService.remove(id)
