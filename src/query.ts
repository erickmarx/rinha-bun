import { Database } from "bun:sqlite";

export const db = new Database("./data/database.SQLite3");

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA threads = 4;");
db.exec("PRAGMA busy_timeout = 30000;");
db.exec("PRAGMA temp_store = MEMORY;");
db.exec("PRAGMA cache_size = 10000;");
db.exec("PRAGMA auto_vacuum = FULL;");
db.exec("PRAGMA automatic_indexing = TRUE;");
db.exec("PRAGMA count_changes = FALSE;");
db.exec('PRAGMA encoding = "UTF-8";');
db.exec("PRAGMA ignore_check_constraints = TRUE;");
db.exec("PRAGMA incremental_vacuum = 0;");
db.exec("PRAGMA legacy_file_format = FALSE;");
db.exec("PRAGMA optimize = On;");
db.exec("PRAGMA synchronous = NORMAL;");

db.exec(`CREATE TABLE IF NOT EXISTS customers (
	id INTEGER PRIMARY KEY,
	limite INTEGER,
	saldo INTEGER DEFAULT 0
)`);

db.exec(`CREATE TABLE IF NOT EXISTS transacoes (
	id INTEGER PRIMARY KEY,
	customerId INTEGER,
	valor INTEGER,
	tipo TEXT,
	descricao TEXT,
	realizada_em DATETIME DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))
)`);

db.exec(`DELETE FROM customers`);

db.exec(`INSERT INTO customers (id, limite) VALUES
  (1, 100000),
  (2, 80000),
  (3, 1000000),
  (4, 10000000),
  (5, 500000)`);

db.exec(`CREATE INDEX IF NOT EXISTS 
  idx_transacoes_customerId 
  ON transacoes (customerId)`);

export const findTransacoesPrepared = db.prepare(
  `SELECT id, valor, tipo, descricao, realizada_em FROM transacoes t WHERE t.customerId = ?1 ORDER BY t.realizada_em DESC LIMIT 10`
);

export const findCustomerPrepared = db.prepare(
  "SELECT limite, saldo FROM customers WHERE id = ?1"
);

export const updateSaldoPrepared = db.prepare(
  "UPDATE customers SET saldo = ?1 WHERE id = ?2"
);
export const insertTransacaoPrepared = db.prepare(
  "INSERT INTO transacoes (valor, tipo, descricao, customerId) VALUES (?1, ?2, ?3, ?4)"
);
