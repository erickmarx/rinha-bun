export interface IStatement {
  saldo: {
    total: number;
    data_extrato: string;
    limite: number;
  };
  ultimas_transacoes: {
    valor: number;
    tipo: string;
    descricao: string;
    realizada_em: string;
  }[];
}
