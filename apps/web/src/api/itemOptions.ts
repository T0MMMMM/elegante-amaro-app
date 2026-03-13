import type { ItemOption } from '@elegante-amaro-app/shared/types'

// TODO: replace with real API base URL
const BASE = '/api'

// TODO: connect to API — GET /item-options
export async function getItemOptions(): Promise<ItemOption[]> {
  void BASE
  return []
}

// TODO: connect to API — POST /item-options
export async function createItemOption(_data: Omit<ItemOption, 'id'>): Promise<ItemOption> {
  throw new Error('TODO: createItemOption not implemented')
}

// TODO: connect to API — PUT /item-options/:id
export async function updateItemOption(_id: number, _data: Partial<ItemOption>): Promise<ItemOption> {
  throw new Error('TODO: updateItemOption not implemented')
}

// TODO: connect to API — DELETE /item-options/:id
export async function deleteItemOption(_id: number): Promise<void> {
  throw new Error('TODO: deleteItemOption not implemented')
}
