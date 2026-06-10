import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'local.db')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR)
}

const sqlite = sqlite3.verbose()
const db = new sqlite.Database(DB_PATH)

// Initialize minimal tables used by the app when running in local fallback mode
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    nome TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'CORRETOR',
    createdAt TEXT DEFAULT (datetime('now'))
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS Imovel (
    id TEXT PRIMARY KEY,
    titulo TEXT,
    descricao TEXT,
    preco REAL,
    tipo TEXT,
    status TEXT DEFAULT 'VENDA',
    userId TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  )`)
})

export function getDb() {
  return db
}

export async function closeDb() {
  return new Promise<void>((resolve, reject) => {
    db.close((err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
