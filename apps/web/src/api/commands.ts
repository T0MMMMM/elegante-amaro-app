import type { Command } from '@elegante-amaro-app/shared/types'

// TODO: replace with real API base URL
const BASE = '/api'

// TODO: connect to API — GET /commands
export async function getCommands(): Promise<Command[]> {
  void BASE
  return []
}

// TODO: connect to API — POST /commands
export async function createCommand(_data: Omit<Command, 'id' | 'created_at' | 'updated_at'>): Promise<Command> {
  throw new Error('TODO: createCommand not implemented')
}

// TODO: connect to API — PUT /commands/:id
export async function updateCommand(_id: number, _data: Partial<Command>): Promise<Command> {
  throw new Error('TODO: updateCommand not implemented')
}

// TODO: connect to API — DELETE /commands/:id
export async function deleteCommand(_id: number): Promise<void> {
  throw new Error('TODO: deleteCommand not implemented')
}
