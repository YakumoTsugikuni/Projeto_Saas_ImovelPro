// Tipos globais do projeto ImóvelPro

export interface Imovel {
  id: string
  titulo: string
  descricao: string | null
  tipo: 'CASA' | 'APARTAMENTO' | 'TERRENO' | 'COMERCIAL' | 'RURAL' | 'STUDIO'
  status: 'VENDA' | 'ALUGUEL' | 'VENDIDO' | 'ALUGADO'
  preco: number
  area: number | null
  quartos: number | null
  banheiros: number | null
  vagas: number | null
  endereco: string
  cidade: string
  estado: string
  cep: string | null
  imagens: string
  destaque: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  _count?: { visitas: number }
}

export interface Cliente {
  id: string
  nome: string
  email: string | null
  telefone: string
  tipo: 'COMPRADOR' | 'LOCATARIO' | 'PROPRIETARIO'
  interesse: string | null
  orcamento: number | null
  observacoes: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  _count?: { visitas: number }
}

export interface Visita {
  id: string
  dataHora: Date
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA'
  observacoes: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  imovelId: string
  clienteId: string
  imovel?: Imovel
  cliente?: Cliente
}

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  creci: string | null
  empresa: string | null
  role: 'ADMIN' | 'CORRETOR'
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalImoveis: number
  totalClientes: number
  totalVisitas: number
  portfolioTotal: number
  imoveisPorStatus: Array<{ status: string; _count: number }>
  visitasProximas: Visita[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  statusCode: number
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export {}
