import type { CommandType } from '@elegante-amaro-app/shared/types'
import { commandTypesService } from '../services'

export const getCommandTypes    = ()                                        => commandTypesService.getAll()
export const createCommandType  = (data: Omit<CommandType, 'id'>)           => commandTypesService.create(data)
export const updateCommandType  = (id: number, data: Partial<CommandType>)  => commandTypesService.update(id, data)
export const deleteCommandType  = (id: number)                              => commandTypesService.remove(id)
