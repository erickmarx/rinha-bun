import { pool } from "../database";
import type { IDepositBody } from "../interfaces/deposit-dto.interface";
import { postDepositValidation } from "../validation";

export async function postDeposit(
  customerId: number,
  body: IDepositBody,
  set: any
) {
  const validation = postDepositValidation(customerId, body, set);

  if (validation.status !== 200) {
    return;
  }

  const customer: {
    limite: number;
    saldo: number;
  } = (await pool.query("SELECT * FROM customers WHERE id = $1", [customerId]))
    .rows[0];

  if (!customer) {
    set.status = 404;
    return;
  }

  let saldo = 0;

  if (body.tipo === "d") {
    const debit = await pool.query<{ saldofinal: number; error: boolean }>(
      "SELECT * FROM debit ($1, $2, $3)",
      [customerId, body.valor, body.descricao]
    );

    const { saldofinal, error } = debit.rows[0];

    if (error) {
      set.status = 422;
      return "saldo insuficente";
    }

    saldo = saldofinal;
  }

  if (body.tipo === "c") {
    const credit = await pool.query<{ saldofinal: number }>(
      "SELECT * FROM credit ($1, $2, $3)",
      [customerId, body.valor, body.descricao]
    );

    saldo = credit.rows[0].saldofinal;
  }

  return {
    limite: customer.limite,
    saldo,
  };
}
