export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDatetime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const tipoImovelLabel: Record<string, string> = {
  CASA: 'Casa',
  APARTAMENTO: 'Apartamento',
  TERRENO: 'Terreno',
  COMERCIAL: 'Comercial',
  RURAL: 'Rural',
  STUDIO: 'Studio',
}

export const statusImovelLabel: Record<string, string> = {
  VENDA: 'À Venda',
  ALUGUEL: 'Para Alugar',
  VENDIDO: 'Vendido',
  ALUGADO: 'Alugado',
}

export const tipoClienteLabel: Record<string, string> = {
  COMPRADOR: 'Comprador',
  VENDEDOR: 'Vendedor',
  LOCATARIO: 'Locatário',
  PROPRIETARIO: 'Proprietário',
}

export const statusVisitaLabel: Record<string, string> = {
  AGENDADA: 'Agendada',
  REALIZADA: 'Realizada',
  CANCELADA: 'Cancelada',
}
