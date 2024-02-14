import { pool } from "../database";
import { getStatementValidation } from "../validation";

export async function getStatement(
  customerId: number,
  set: { status: number }
) {
  const validation = getStatementValidation(customerId, set);

  if (validation.status !== 200) {
    return;
  }

  const customer: {
    saldo: number;
    limite: number;
  } = (await pool.query("SELECT * FROM customers WHERE id = $1", [customerId]))
    .rows[0];

  if (!customer) {
    set.status = 404;
    return;
  }

  const ultimas_transacoes: {
    valor: number;
    tipo: string;
    descricao: string;
    realizada_em: string;
  }[] = (
    await pool.query(
      "SELECT * FROM transacoes WHERE customerId = $1 ORDER BY realizada_em DESC LIMIT 10",
      [customerId]
    )
  ).rows;

  return {
    saldo: {
      total: customer.saldo,
      data_extrato: new Date().toISOString(),
      limite: customer.limite,
    },
    ultimas_transacoes,
  };
}
