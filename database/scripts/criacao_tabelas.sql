CREATE TABLE STATUS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE CLIENTE (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    observacoes TEXT
);

CREATE TABLE DIVIDA (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL, -- Chave estrangeira para CLIENTE
    status_id INTEGER NOT NULL,  -- Chave estrangeira para STATUS
    valor REAL NOT NULL,
    data_registro TEXT NOT NULL,
    data_vencimento TEXT,
    observacoes TEXT,
    
    -- Definição das Chaves Estrangeiras
    FOREIGN KEY (cliente_id) REFERENCES CLIENTE(id),
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
);

INSERT INTO STATUS (nome) VALUES ('Devendo'); -- Será o status padrão para novas dívidas
INSERT INTO STATUS (nome) VALUES ('Pago');
INSERT INTO STATUS (nome) VALUES ('Cancelado');
