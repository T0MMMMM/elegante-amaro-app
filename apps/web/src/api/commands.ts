import type { Command } from '@elegante-amaro-app/shared/types'
import { commandsService } from '../services'

export const getCommands  = (includeDeleted = false)                                  => commandsService.getAll(includeDeleted)
export const createCommand = (data: Omit<Command, 'id' | 'created_at' | 'updated_at'>) => commandsService.create(data)
export const updateCommand = (id: number, data: Partial<Command>)                      => commandsService.update(id, data)
export const deleteCommand = (id: number)                                              => commandsService.remove(id)
