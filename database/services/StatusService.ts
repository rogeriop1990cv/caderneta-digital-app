import { db } from '@/database/Database'

export interface IStatus {
  id: number
  nome: string
}

/**
 * Retorna todos os status disponíveis para as dívidas.
 */
export const getStatusList = async () => {
  if (!db) {
    throw new Error('db não existe')
  }
  const sql = 'SELECT * FROM STATUS ORDER BY id ASC'
  const status: IStatus[] = await db.getAllAsync(sql)
  return status
}

/**
 * Retorna o ID de um status pelo nome (útil para lógica de status padrão).
 */
export const getStatusIdByName = async (name: string) => {
  if (!db) {
    throw new Error('db não existe')
  }
  const sql = 'SELECT id FROM STATUS WHERE nome = ?'
  const result: IStatus | null = await db.getFirstAsync(sql, name)

  return result ? result.id : null
}
