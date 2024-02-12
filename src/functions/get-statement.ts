import { findCustomerPrepared, findTransacoesPrepared } from "../query";
import { getStatementValidation } from "../validation";

export async function getStatement(id: number, set: { status: number }) {
  const validation = getStatementValidation(id, set);

  if (validation.status !== 200) {
    return;
  }

  const customer = (await findCustomerPrepared.get(id)) as {
    saldo: number;
    limite: number;
  };

  if (!customer) {
    set.status = 404;
    return;
  }

  const ultimas_transacoes = findTransacoesPrepared.all(id) as {
    valor: number;
    tipo: string;
    descricao: string;
    realizada_em: string;
  }[];

  return {
    saldo: {
      total: customer.saldo,
      data_extrato: new Date().toISOString(),
      limite: customer.limite,
    },
    ultimas_transacoes,
  };
}
