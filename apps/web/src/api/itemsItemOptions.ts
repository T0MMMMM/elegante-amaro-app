import type { ItemItemOption } from '@elegante-amaro-app/shared/types'
import { itemsItemOptionsService } from '../services'

export const getItemsItemOptions    = ()                                  => itemsItemOptionsService.getAll()
export const createItemItemOption   = (data: Omit<ItemItemOption, 'id'>) => itemsItemOptionsService.create(data)
export const deleteItemItemOption   = (id: number)                        => itemsItemOptionsService.remove(id)
