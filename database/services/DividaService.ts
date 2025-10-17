import { db } from '../Database'

interface IDivida {
  id: number
  cliente_id: number
  status_id: number
  valor: number
  data_registro?: string
  data_vencimento: string
  observacoes: string
}

type CreateDividaInput = Omit<IDivida, 'id'>
type UpdateDividaInput = Omit<IDivida, 'cliente_id'>

/**
 * CRUD: DIVIDA - Cria um novo registro de dívida.
 * Usa o status padrão 'Devendo' (ID 1 do seed).
 */
export const createDivida = async ({
  cliente_id,
  valor,
  data_registro = '',
  data_vencimento,
  observacoes,
}: CreateDividaInput) => {
  if (!db) throw new Error('db não existe')

  const status_devendo_id = 1

  const sql = `
        INSERT INTO DIVIDA 
        (cliente_id, status_id, valor, data_registro, data_vencimento, observacoes) 
        VALUES (?, ?, ?, ?, ?, ?)
    `
  const params = [cliente_id, status_devendo_id, valor, data_registro, data_vencimento, observacoes]

  const result = await db.runAsync(sql, ...params)
  return result.lastInsertRowId
}

/**
 * CRUD: DIVIDA - Retorna todos os registros de dívidas com JOINs para dados legíveis.
 * Traz o nome do Cliente e o nome do Status.
 */
export const getDividas = async () => {
  if (!db) throw new Error('db não existe')
  const sql = `
        SELECT 
            D.id, 
            D.valor, 
            D.data_registro, 
            D.data_vencimento, 
            D.observacoes,
            C.nome AS cliente_nome,
            S.nome AS status_nome,
            C.id AS cliente_id,
            S.id AS status_id
        FROM DIVIDA D
        JOIN CLIENTE C ON D.cliente_id = C.id
        JOIN STATUS S ON D.status_id = S.id
        ORDER BY D.data_registro DESC
    `

  const dividas = await db.getAllAsync(sql)
  return dividas
}

/**
 * CRUD: DIVIDA - Atualiza o valor, status e/ou observações de uma dívida.
 */
export const updateDivida = async ({ id, valor, status_id, data_vencimento, observacoes }: UpdateDividaInput) => {
  if (!db) throw new Error('db não existe')

  const sql = `
        UPDATE DIVIDA 
        SET valor = ?, status_id = ?, data_vencimento = ?, observacoes = ? 
        WHERE id = ?
    `
  const params = [valor, status_id, data_vencimento, observacoes, id]

  const result = await db.runAsync(sql, ...params)
  return result.changes
}

/**
 * CRUD: DIVIDA - Deleta um registro de dívida.
 */
export const deleteDivida = async (id: number) => {
  if (!db) throw new Error('db não existe')

  const sql = 'DELETE FROM DIVIDA WHERE id = ?'
  const result = await db.runAsync(sql, id)
  return result.changes
}
