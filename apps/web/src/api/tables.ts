import type { Table } from '@elegante-amaro-app/shared/types'
import { tablesService } from '../services'

export const getTables    = (includeDeleted = false)          => tablesService.getAll(includeDeleted)
export const createTable  = (data: Omit<Table, 'id'>)         => tablesService.create(data)
export const updateTable  = (id: number, data: Partial<Table>) => tablesService.update(id, data)
export const deleteTable  = (id: number)                      => tablesService.remove(id)
