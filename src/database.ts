import { Pool } from "pg";

export const pool = new Pool({
  host: "0.0.0.0",
  port: 5432,
  user: "postgres",
  password: "123",
  database: "rinha",
});