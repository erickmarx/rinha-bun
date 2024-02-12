import { getStatement } from "./functions/get-statement";
import { postDeposit } from "./functions/post-deposit";

const getStatementRegex = new RegExp(/clientes\/(\d+)\/extrato/);
const postDepositRegex = new RegExp(/clientes\/(\d+)\/transacoes/);

const requestHandler = async (req: Request) => {
  const url = new URL(req.url);
  const set = { status: 200 };

  if (req.method === "GET" && getStatementRegex.test(url.pathname)) {
    const id = +getStatementRegex.exec(url.pathname)![1];
    const statement = await getStatement(id, set);
    return { status: set.status, body: statement };
  }

  if (req.method === "POST" && postDepositRegex.test(url.pathname)) {
    const id = +postDepositRegex.exec(url.pathname)![1];
    const body = await req.json();
    const deposit = await postDeposit(id, body, set);
    return { status: set.status, body: deposit };
  }
};
const port = Bun.env.PORT!;
Bun.serve({
  port,
  async fetch(request) {
    const requestHandlerResponse = await requestHandler(request);

    if (!requestHandlerResponse) {
      return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify(requestHandlerResponse.body), {
      status: requestHandlerResponse.status,
    });
  },
});

console.log(`Server is running at on port ${port}...`);
