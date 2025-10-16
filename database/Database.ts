import type { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'caderneta_digital.db';
export let db: SQLiteDatabase | null = null; // Instância do DB será exportada

/**
 * Script SQL de inicialização (com IF NOT EXISTS e Seed)
 */
const INIT_SQL_COMMANDS = `
PRAGMA journal_mode = WAL; 
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS STATUS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS CLIENTE (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    observacoes TEXT
);

CREATE TABLE IF NOT EXISTS DIVIDA (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    data_registro TEXT NOT NULL,
    data_vencimento TEXT,
    observacoes TEXT,
    
    FOREIGN KEY (cliente_id) REFERENCES CLIENTE(id) ON DELETE CASCADE, 
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
);

INSERT OR IGNORE INTO STATUS (id, nome) VALUES (1, 'Devendo');
INSERT OR IGNORE INTO STATUS (id, nome) VALUES (2, 'Pago');
INSERT OR IGNORE INTO STATUS (id, nome) VALUES (3, 'Cancelado');
`;

/**
 * Abre a conexão e inicializa a estrutura do banco de dados.
 */
export const initDatabase = async () => {
    console.log('Abrindo e inicializando o banco de dados...');
    
    // Abre o banco de dados e atribui à variável global
    db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Executa o script de inicialização
    await db.execAsync(INIT_SQL_COMMANDS);
    
    console.log('Banco de dados inicializado com sucesso.');
};
