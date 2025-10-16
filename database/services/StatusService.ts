import { db } from '@/database/Database'

/**
 * Retorna todos os status disponíveis para as dívidas.
 */
export const getStatusList = async () => {
  if (!db) {
    throw new Error('db não existe')
  }
  const sql = 'SELECT * FROM STATUS ORDER BY id ASC'
  const status = await db.getAllAsync(sql)
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
  const result = await db.getFirstAsync(sql, name) // getFirstAsync retorna o primeiro item ou null  

  return result ? result.id : null
}
