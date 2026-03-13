import type { Item } from '@elegante-amaro-app/shared/types'

// TODO: replace with real API base URL
const BASE = '/api'

// TODO: connect to API — GET /items
export async function getItems(): Promise<Item[]> {
  void BASE
  return []
}

// TODO: connect to API — POST /items
export async function createItem(_data: Omit<Item, 'id'>): Promise<Item> {
  throw new Error('TODO: createItem not implemented')
}

// TODO: connect to API — PUT /items/:id
export async function updateItem(_id: number, _data: Partial<Item>): Promise<Item> {
  throw new Error('TODO: updateItem not implemented')
}

// TODO: connect to API — DELETE /items/:id
export async function deleteItem(_id: number): Promise<void> {
  throw new Error('TODO: deleteItem not implemented')
}
