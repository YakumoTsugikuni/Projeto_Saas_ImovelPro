/**
 * VALIDAÇÃO DE ENTRADA COM ZOD
 * Arquivo criado para centralizar validações e proteger contra:
 * - XSS (injeção de scripts)
 * - SQL Injection (embora Prisma já mitigue)
 * - Type confusion
 * - Dados malformados
 */

// Instalação necessária: npm install zod --legacy-peer-deps
// Se zod não estiver instalado, usar validações básicas abaixo

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres` };
  }
  
  // Validação: pelo menos 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      error: 'Senha deve conter: maiúsculas, minúsculas, números e caracteres especiais (@$!%*?&)',
    };
  }
  
  return { valid: true };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function sanitizeString(input: string | undefined): string {
  if (!input) return '';
  
  return input
    .trim()
    .slice(0, 500) // Limita tamanho
    .replace(/[<>]/g, ''); // Remove tags HTML potenciais
}

export function validateNumericString(input: any): number | null {
  const num = parseFloat(input);
  return isNaN(num) || !isFinite(num) ? null : num;
}

export function validateIntegerString(input: any): number | null {
  const num = parseInt(input, 10);
  return isNaN(num) || !isFinite(num) ? null : num;
}

export interface ValidatedClienteData {
  nome: string;
  email?: string;
  telefone: string;
  tipo?: string;
  interesse?: string;
  orcamento?: number;
  observacoes?: string;
}

export interface ValidatedImovelData {
  titulo: string;
  descricao?: string;
  tipo?: string;
  status?: string;
  preco: number;
  area?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string;
  imagens?: string;
  destaque?: boolean;
}

export function validateClienteInput(data: any): { valid: boolean; data?: ValidatedClienteData; error?: string } {
  if (!data.nome || typeof data.nome !== 'string' || data.nome.trim().length === 0) {
    return { valid: false, error: 'Nome é obrigatório' };
  }

  if (!data.telefone || typeof data.telefone !== 'string' || data.telefone.trim().length === 0) {
    return { valid: false, error: 'Telefone é obrigatório' };
  }

  if (data.email && !validateEmail(data.email)) {
    return { valid: false, error: 'Email inválido' };
  }

  const orcamento = data.orcamento ? validateNumericString(data.orcamento) : undefined;
  if (data.orcamento && orcamento === null) {
    return { valid: false, error: 'Orçamento deve ser um número válido' };
  }

  return {
    valid: true,
    data: {
      nome: sanitizeString(data.nome),
      email: data.email ? sanitizeString(data.email) : undefined,
      telefone: sanitizeString(data.telefone),
      tipo: data.tipo ? sanitizeString(data.tipo) : 'COMPRADOR',
      interesse: data.interesse ? sanitizeString(data.interesse) : undefined,
      orcamento,
      observacoes: data.observacoes ? sanitizeString(data.observacoes) : undefined,
    },
  };
}

export function validateImovelInput(data: any): { valid: boolean; data?: ValidatedImovelData; error?: string } {
  if (!data.titulo || typeof data.titulo !== 'string' || data.titulo.trim().length === 0) {
    return { valid: false, error: 'Título é obrigatório' };
  }

  if (!data.endereco || typeof data.endereco !== 'string' || data.endereco.trim().length === 0) {
    return { valid: false, error: 'Endereço é obrigatório' };
  }

  if (!data.cidade || typeof data.cidade !== 'string' || data.cidade.trim().length === 0) {
    return { valid: false, error: 'Cidade é obrigatória' };
  }

  if (!data.estado || typeof data.estado !== 'string' || data.estado.trim().length === 0) {
    return { valid: false, error: 'Estado é obrigatório' };
  }

  const preco = validateNumericString(data.preco);
  if (preco === null || preco <= 0) {
    return { valid: false, error: 'Preço deve ser um número válido maior que 0' };
  }

  const area = data.area ? validateNumericString(data.area) : undefined;
  if (data.area && area === null) {
    return { valid: false, error: 'Área deve ser um número válido' };
  }

  const quartos = data.quartos ? validateIntegerString(data.quartos) : undefined;
  if (data.quartos && quartos === null) {
    return { valid: false, error: 'Quartos deve ser um número inteiro válido' };
  }

  const banheiros = data.banheiros ? validateIntegerString(data.banheiros) : undefined;
  if (data.banheiros && banheiros === null) {
    return { valid: false, error: 'Banheiros deve ser um número inteiro válido' };
  }

  const vagas = data.vagas ? validateIntegerString(data.vagas) : undefined;
  if (data.vagas && vagas === null) {
    return { valid: false, error: 'Vagas deve ser um número inteiro válido' };
  }

  return {
    valid: true,
    data: {
      titulo: sanitizeString(data.titulo),
      descricao: data.descricao ? sanitizeString(data.descricao) : undefined,
      tipo: data.tipo ? sanitizeString(data.tipo) : 'APARTAMENTO',
      status: data.status ? sanitizeString(data.status) : 'VENDA',
      preco,
      area,
      quartos,
      banheiros,
      vagas,
      endereco: sanitizeString(data.endereco),
      cidade: sanitizeString(data.cidade),
      estado: sanitizeString(data.estado),
      cep: data.cep ? sanitizeString(data.cep) : undefined,
      imagens: data.imagens ? sanitizeString(data.imagens) : undefined,
      destaque: typeof data.destaque === 'boolean' ? data.destaque : false,
    },
  };
}
