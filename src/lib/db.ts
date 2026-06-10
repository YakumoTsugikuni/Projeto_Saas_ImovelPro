import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { getDb } from '@/lib/sqlite'

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

const databaseUrl = process.env.DATABASE_URL

// If DATABASE_URL is not set or we detect a local-only environment, fall back to SQLite shim
if (!databaseUrl) {
  // Minimal Prisma-like shim backed by SQLite for offline/local mode
  const db = getDb()

  const shim = {
    _isSqliteShim: true,
    user: {
      findUnique: async ({ where }: any) => {
        return new Promise((resolve, reject) => {
          db.get('SELECT * FROM User WHERE id = ? OR email = ?', [where.id ?? where.email, where.email ?? where.id], (err, row) => {
            if (err) return reject(err)
            resolve(row)
          })
        })
      },
      create: async ({ data }: any) => {
        const id = data.id || data.email
        return new Promise((resolve, reject) => {
          db.run('INSERT INTO User (id,nome,email,password,role) VALUES (?,?,?,?,?)', [id, data.nome || null, data.email, data.password, data.role || 'CORRETOR'], function (err) {
            if (err) return reject(err)
            db.get('SELECT * FROM User WHERE id = ?', [id], (e, row) => (e ? reject(e) : resolve(row)))
          })
        })
      },
      update: async ({ where, data }: any) => {
        const fields = Object.keys(data)
        const sets = fields.map((f) => `${f} = ?`).join(', ')
        const values = fields.map((f) => (data as any)[f])
        return new Promise((resolve, reject) => {
          db.run(`UPDATE User SET ${sets} WHERE id = ?`, [...values, where.id], function (err) {
            if (err) return reject(err)
            db.get('SELECT * FROM User WHERE id = ?', [where.id], (e, row) => (e ? reject(e) : resolve(row)))
          })
        })
      }
    },
    imovel: {
      findMany: async ({ where }: any) => {
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM Imovel WHERE userId = ? OR 1=1', [where?.userId ?? null], (err, rows) => {
            if (err) return reject(err)
            resolve(rows)
          })
        })
      },
      create: async ({ data }: any) => {
        const id = data.id || data.titulo
        return new Promise((resolve, reject) => {
          db.run('INSERT INTO Imovel (id,titulo,descricao,preco,tipo,status,userId) VALUES (?,?,?,?,?,?,?)', [id, data.titulo, data.descricao || null, data.preco || 0, data.tipo || null, data.status || 'VENDA', data.userId || null], function (err) {
            if (err) return reject(err)
            db.get('SELECT * FROM Imovel WHERE id = ?', [id], (e, row) => (e ? reject(e) : resolve(row)))
          })
        })
      },
      findUnique: async ({ where }: any) => {
        return new Promise((resolve, reject) => {
          db.get('SELECT * FROM Imovel WHERE id = ?', [where.id], (err, row) => {
            if (err) return reject(err)
            resolve(row)
          })
        })
      },
      update: async ({ where, data }: any) => {
        const fields = Object.keys(data)
        const sets = fields.map((f) => `${f} = ?`).join(', ')
        const values = fields.map((f) => (data as any)[f])
        return new Promise((resolve, reject) => {
          db.run(`UPDATE Imovel SET ${sets} WHERE id = ?`, [...values, where.id], function (err) {
            if (err) return reject(err)
            db.get('SELECT * FROM Imovel WHERE id = ?', [where.id], (e, row) => (e ? reject(e) : resolve(row)))
          })
        })
      },
      delete: async ({ where }: any) => {
        return new Promise((resolve, reject) => {
          db.run('DELETE FROM Imovel WHERE id = ?', [where.id], function (err) {
            if (err) return reject(err)
            resolve({ count: this.changes })
          })
        })
      }
    },
        findMany: async ({ where }: any) => {
          return new Promise((resolve, reject) => {
            db.all('SELECT * FROM Imovel WHERE userId = ? OR 1=1', [where?.userId ?? null], (err, rows) => {
              if (err) return reject(err)
              resolve(rows)
            })
          })
        },
        create: async ({ data }: any) => {
          const id = data.id || data.titulo
          return new Promise((resolve, reject) => {
            db.run('INSERT INTO Imovel (id,titulo,descricao,preco,tipo,status,userId) VALUES (?,?,?,?,?,?,?)', [id, data.titulo, data.descricao || null, data.preco || 0, data.tipo || null, data.status || 'VENDA', data.userId || null], function (err) {
              if (err) return reject(err)
              db.get('SELECT * FROM Imovel WHERE id = ?', [id], (e, row) => (e ? reject(e) : resolve(row)))
            })
          })
        },
        findUnique: async ({ where }: any) => {
          return new Promise((resolve, reject) => {
            db.get('SELECT * FROM Imovel WHERE id = ?', [where.id], (err, row) => {
              if (err) return reject(err)
              resolve(row)
            })
          })
        },
        update: async ({ where, data }: any) => {
          const fields = Object.keys(data)
          const sets = fields.map((f) => `${f} = ?`).join(', ')
          const values = fields.map((f) => (data as any)[f])
          return new Promise((resolve, reject) => {
            db.run(`UPDATE Imovel SET ${sets} WHERE id = ?`, [...values, where.id], function (err) {
              if (err) return reject(err)
              db.get('SELECT * FROM Imovel WHERE id = ?', [where.id], (e, row) => (e ? reject(e) : resolve(row)))
            })
          })
        },
        delete: async ({ where }: any) => {
          return new Promise((resolve, reject) => {
            db.run('DELETE FROM Imovel WHERE id = ?', [where.id], function (err) {
              if (err) return reject(err)
              resolve({ count: this.changes })
            })
          })
        }
      }
    },
    cliente: {
      findMany: async ({ where }: any) => {
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM Cliente WHERE userId = ? OR 1=1', [where?.userId ?? null], (err, rows) => {
            if (err) return reject(err)
            resolve(rows)
          })
        })
      },
      create: async ({ data }: any) => {
        const id = data.id || data.email
        return new Promise((resolve, reject) => {
          db.run('INSERT INTO Cliente (id,nome,email,telefone,tipo,userId) VALUES (?,?,?,?,?,?)', [id, data.nome, data.email, data.telefone || null, data.tipo || null, data.userId || null], function (err) {
            if (err) return reject(err)
            db.get('SELECT * FROM Cliente WHERE id = ?', [id], (e, row) => (e ? reject(e) : resolve(row)))
          })
        })
      },
      delete: async ({ where }: any) => {
        return new Promise((resolve, reject) => {
          db.run('DELETE FROM Cliente WHERE id = ?', [where.id], function (err) {
            if (err) return reject(err)
            resolve({ count: this.changes })
          })
        })
      },
      update: async ({ where, data }: any) => {
        const fields = Object.keys(data)
        const sets = fields.map((f) => `${f} = ?`).join(', ')
        const values = fields.map((f) => (data as any)[f])
        return new Promise((resolve, reject) => {
          db.run(`UPDATE Cliente SET ${sets} WHERE id = ?`, [...values, where.id], function (err) {
            if (err) return reject(err)
            db.get('SELECT * FROM Cliente WHERE id = ?', [where.id], (e, row) => (e ? reject(e) : resolve(row)))
          })
        })
      }
    },
    visita: {
      findMany: async ({ where }: any) => {
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM Visita WHERE userId = ? OR 1=1', [where?.userId ?? null], (err, rows) => {
            if (err) return reject(err)
            resolve(rows)
          })
        })
      },
      create: async ({ data }: any) => {
        const id = data.id || data.dataVisita
        return new Promise((resolve, reject) => {
          db.run('INSERT INTO Visita (id,dataVisita,status,observacoes,imovelId,clienteId,userId) VALUES (?,?,?,?,?,?,?)', [id, data.dataVisita, data.status || 'AGENDADA', data.observacoes || null, data.imovelId || null, data.clienteId || null, data.userId || null], function (err) {
            if (err) return reject(err)
            db.get('SELECT * FROM Visita WHERE id = ?', [id], (e, row) => (e ? reject(e) : resolve(row)))
          })
        })
      },
      update: async ({ where, data }: any) => {
        const fields = Object.keys(data)
        const sets = fields.map((f) => `${f} = ?`).join(', ')
        const values = fields.map((f) => (data as any)[f])
        return new Promise((resolve, reject) => {
          db.run(`UPDATE Visita SET ${sets} WHERE id = ?`, [...values, where.id], function (err) {
            if (err) return reject(err)
            db.get('SELECT * FROM Visita WHERE id = ?', [where.id], (e, row) => (e ? reject(e) : resolve(row)))
          })
        })
      },
      delete: async ({ where }: any) => {
        return new Promise((resolve, reject) => {
          db.run('DELETE FROM Visita WHERE id = ?', [where.id], function (err) {
            if (err) return reject(err)
            resolve({ count: this.changes })
          })
        })
      }
    }
  }
    }
  }

  export const prisma = shim
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  process.env.PRISMA_USING_LOCAL = 'true'
} else {
  const pgAdapter = new PrismaPg(databaseUrl)
  const clientOptions = { adapter: pgAdapter }
  export const prisma = globalForPrisma.prisma ?? new PrismaClient(clientOptions)
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
}
