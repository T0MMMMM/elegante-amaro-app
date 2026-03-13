import type { StateCommand } from '@elegante-amaro-app/shared/types'

// TODO: replace with real API base URL
const BASE = '/api'

// TODO: connect to API — GET /state-commands
export async function getStateCommands(): Promise<StateCommand[]> {
  void BASE
  return []
}

// TODO: connect to API — POST /state-commands
export async function createStateCommand(_data: Omit<StateCommand, 'id'>): Promise<StateCommand> {
  throw new Error('TODO: createStateCommand not implemented')
}

// TODO: connect to API — PUT /state-commands/:id
export async function updateStateCommand(_id: number, _data: Partial<StateCommand>): Promise<StateCommand> {
  throw new Error('TODO: updateStateCommand not implemented')
}

// TODO: connect to API — DELETE /state-commands/:id
export async function deleteStateCommand(_id: number): Promise<void> {
  throw new Error('TODO: deleteStateCommand not implemented')
}
