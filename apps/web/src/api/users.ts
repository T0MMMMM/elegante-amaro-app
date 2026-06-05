import type { User } from '@elegante-amaro-app/shared/types'
import { usersService } from '../services'

export const getUsers    = ()                               => usersService.getAll()
export const createUser  = (data: Omit<User, 'id'>)         => usersService.create(data)
export const updateUser  = (id: number, data: Partial<User>) => usersService.update(id, data)
export const deleteUser  = (id: number)                     => usersService.remove(id)
