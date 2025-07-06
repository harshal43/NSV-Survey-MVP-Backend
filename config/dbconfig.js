import dotenv from "dotenv";
dotenv.config();
import Pool from "pg-pool";
import pg from "pg";
import { Client } from "pg";

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DB,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
  max: 20,
  idleTimeoutMillis: 120000,
  connectionTimeoutMillis: 120000,
});

export default pool ;
