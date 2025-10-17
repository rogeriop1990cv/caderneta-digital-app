import { db } from '../Database'

export interface ICliente {
  id: number
  nome: string
  observacoes: string
  telefone: string
}

/**
 * CRUD: CLIENTE - Cria um novo cliente
 */

export const createCliente = async (nome: string, telefone: string, observacoes: string): Promise<number> => {
  if (!db) throw new Error('db não existe')

  const sql = 'INSERT INTO CLIENTE (nome, telefone, observacoes) VALUES (?, ?, ?)'
  const result = await db.runAsync(sql, nome, telefone, observacoes)
  return result.lastInsertRowId
}

/**
 * CRUD: CLIENTE - Retorna todos os clientes
 */
export const getClientes = async () => {
  if (!db) throw new Error('db não existe')

  const sql = 'SELECT * FROM CLIENTE ORDER BY nome ASC'
  const clientes: ICliente[] = await db.getAllAsync(sql)
  return clientes
}

/**
 * CRUD: CLIENTE - Atualiza um cliente existente
 */
export const updateCliente = async (id: number, nome: string, telefone: string, observacoes: string) => {
  if (!db) throw new Error('db não existe')

  const sql = 'UPDATE CLIENTE SET nome = ?, telefone = ?, observacoes = ? WHERE id = ?'
  const result = await db.runAsync(sql, nome, telefone, observacoes, id)
  return result.changes
}

/**
 * CRUD: CLIENTE - Deleta um cliente
 * Devido ao ON DELETE CASCADE no Database.js, as dívidas associadas também serão deletadas.
 */
export const deleteCliente = async (id: number) => {
  if (!db) throw new Error('db não existe')

  const sql = 'DELETE FROM CLIENTE WHERE id = ?'
  const result = await db.runAsync(sql, id)
  return result.changes
}
