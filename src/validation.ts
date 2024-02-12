import type { IDepositBody } from "./interfaces/deposit-dto.interface";

export function getStatementValidation(id: number, set: any) {
  if (typeof id !== "number" || id < 1) {
    set.status = 422;
  }

  return set;
}

export function postDepositValidation(
  id: number,
  body: IDepositBody,
  set: any
) {
  if (typeof id !== "number" || id < 1) {
    set.status = 422;
  }

  if (
    !body.valor ||
    typeof body.valor !== "number" ||
    body.valor < 1 ||
    !Number.isInteger(body.valor)
  ) {
    set.status = 422;
  }

  if (
    !body.tipo ||
    typeof body.tipo !== "string" ||
    !["c", "d"].includes(body.tipo)
  ) {
    set.status = 422;
  }

  if (
    !body.descricao ||
    typeof body.descricao !== "string" ||
    body.descricao.length < 1 ||
    body.descricao.length > 10
  ) {
    set.status = 422;
  }

  return set;
}
