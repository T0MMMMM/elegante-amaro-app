import type { CommandItem } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const commandItemsService = {
  getAll:       ()           => http.get<CommandItem[]>('/commands-items'),
  getByCommand: (id: number) => http.get<CommandItem[]>(`/commands/${id}/items`),
}
