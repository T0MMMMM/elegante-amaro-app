import type { User } from '@elegante-amaro-app/shared/types'

// TODO: replace with real API base URL
const BASE = '/api'

// TODO: connect to API — GET /users
export async function getUsers(): Promise<User[]> {
  void BASE
  return []
}

// TODO: connect to API — POST /users
export async function createUser(_data: Omit<User, 'id'>): Promise<User> {
  throw new Error('TODO: createUser not implemented')
}

// TODO: connect to API — PUT /users/:id
export async function updateUser(_id: number, _data: Partial<User>): Promise<User> {
  throw new Error('TODO: updateUser not implemented')
}

// TODO: connect to API — DELETE /users/:id
export async function deleteUser(_id: number): Promise<void> {
  throw new Error('TODO: deleteUser not implemented')
}
