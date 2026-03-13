import type { Table } from '@elegante-amaro-app/shared/types'

// TODO: replace with real API base URL
const BASE = '/api'

// TODO: connect to API — GET /tables
export async function getTables(): Promise<Table[]> {
  void BASE
  return []
}

// TODO: connect to API — POST /tables
export async function createTable(_data: Omit<Table, 'id'>): Promise<Table> {
  throw new Error('TODO: createTable not implemented')
}

// TODO: connect to API — PUT /tables/:id
export async function updateTable(_id: number, _data: Partial<Table>): Promise<Table> {
  throw new Error('TODO: updateTable not implemented')
}

// TODO: connect to API — DELETE /tables/:id
export async function deleteTable(_id: number): Promise<void> {
  throw new Error('TODO: deleteTable not implemented')
}
