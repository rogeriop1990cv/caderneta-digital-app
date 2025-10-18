import { IDivida } from '@/database/services/DividaService'

/**
 * somarDividas
 *
 * Função que soma todos os itens de uma dividas de um cliente.
 *
 * @param {IDivida[]} [listaDividas = []] - Lista com todas as dividas
 * @returns {number} - soma total de todos os item da lista de divida.
 */
const somarDividas = (listaDividas: IDivida[]): number => {
  interface DividaComValor {
    valor?: string | number | null
  }

  const soma =
    listaDividas?.reduce<number>((acc, curr: DividaComValor) => {
      const valorNumerico = Number(curr.valor) || 0
      return acc + valorNumerico
    }, 0) ?? 0

  return soma
}

export default somarDividas
