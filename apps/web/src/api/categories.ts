import type { Category } from '@elegante-amaro-app/shared/types'

// TODO: replace with real API base URL
const BASE = '/api'

// TODO: connect to API — GET /categories
export async function getCategories(): Promise<Category[]> {
  void BASE
  return []
}

// TODO: connect to API — POST /categories
export async function createCategory(_data: Omit<Category, 'id'>): Promise<Category> {
  throw new Error('TODO: createCategory not implemented')
}

// TODO: connect to API — PUT /categories/:id
export async function updateCategory(_id: number, _data: Partial<Category>): Promise<Category> {
  throw new Error('TODO: updateCategory not implemented')
}

// TODO: connect to API — DELETE /categories/:id
export async function deleteCategory(_id: number): Promise<void> {
  throw new Error('TODO: deleteCategory not implemented')
}
