import type { StateCommand } from '@elegante-amaro-app/shared/types'
import { stateCommandsService } from '../services'

export const getStateCommands    = ()                                          => stateCommandsService.getAll()
export const createStateCommand  = (data: Omit<StateCommand, 'id'>)            => stateCommandsService.create(data)
export const updateStateCommand  = (id: number, data: Partial<StateCommand>)   => stateCommandsService.update(id, data)
export const deleteStateCommand  = (id: number)                                => stateCommandsService.remove(id)
