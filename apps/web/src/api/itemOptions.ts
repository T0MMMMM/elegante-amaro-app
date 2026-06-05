import type { ItemOption } from '@elegante-amaro-app/shared/types'
import { itemOptionsService } from '../services'

export const getItemOptions    = ()                                      => itemOptionsService.getAll()
export const createItemOption  = (data: Omit<ItemOption, 'id'>)          => itemOptionsService.create(data)
export const updateItemOption  = (id: number, data: Partial<ItemOption>)  => itemOptionsService.update(id, data)
export const deleteItemOption  = (id: number)                            => itemOptionsService.remove(id)
