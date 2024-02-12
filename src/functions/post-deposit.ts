import type { IDepositBody } from "../interfaces/deposit-dto.interface";
import {
  findCustomerPrepared,
  updateSaldoPrepared,
  insertTransacaoPrepared,
} from "../query";
import { postDepositValidation } from "../validation";

export async function postDeposit(id: number, body: IDepositBody, set: any) {
  const validation = postDepositValidation(id, body, set);

  if (validation.status !== 200) {
    return;
  }

  const customer = (await findCustomerPrepared.get(id)) as {
    limite: number;
    saldo: number;
  };

  if (!customer) {
    set.status = 404;
    return;
  }

  let newSaldo: number = 0;

  if (body.tipo === "d") {
    newSaldo = customer.saldo - body.valor;

    if (newSaldo < customer.limite * -1) {
      set.status = 422;
      return;
    }
  } else {
    newSaldo = customer.saldo + body.valor;
  }

  await Promise.race([
    updateSaldoPrepared.run(newSaldo, id),
    insertTransacaoPrepared.run(body.valor, body.tipo, body.descricao, id),
  ]);

  return {
    limite: customer.limite,
    saldo: newSaldo,
  };
}
