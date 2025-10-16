import { db } from '../Database';

/**
 * CRUD: DIVIDA - Cria um novo registro de dívida.
 * Usa o status padrão 'Devendo' (ID 1 do seed).
 */
export const createDivida = async (cliente_id, valor, data_registro, observacoes = '', data_vencimento = null) => {
    // Para simplificar, assumimos que o ID 1 é 'Devendo' (conforme o seed no Database.js)
    const status_devendo_id = 1; 

    const sql = `
        INSERT INTO DIVIDA 
        (cliente_id, status_id, valor, data_registro, data_vencimento, observacoes) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
        cliente_id, 
        status_devendo_id, 
        valor, 
        data_registro, 
        data_vencimento, 
        observacoes
    ];
    
    const result = await db.runAsync(sql, ...params);
    return result.lastInsertRowId;
};

/**
 * CRUD: DIVIDA - Retorna todos os registros de dívidas com JOINs para dados legíveis.
 * Traz o nome do Cliente e o nome do Status.
 */
export const getDividas = async () => {
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
    `;
    
    const dividas = await db.getAllAsync(sql);
    return dividas; 
};

/**
 * CRUD: DIVIDA - Atualiza o valor, status e/ou observações de uma dívida.
 */
export const updateDivida = async (id, valor, status_id, data_vencimento, observacoes) => {
    const sql = `
        UPDATE DIVIDA 
        SET valor = ?, status_id = ?, data_vencimento = ?, observacoes = ? 
        WHERE id = ?
    `;
    const params = [valor, status_id, data_vencimento, observacoes, id];
    
    const result = await db.runAsync(sql, ...params);
    return result.changes;
};

/**
 * CRUD: DIVIDA - Deleta um registro de dívida.
 */
export const deleteDivida = async (id) => {
    const sql = 'DELETE FROM DIVIDA WHERE id = ?';
    const result = await db.runAsync(sql, id);
    return result.changes;
};
