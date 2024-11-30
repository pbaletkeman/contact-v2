("use strict");

import { loadEnvFile } from "process";

loadEnvFile(".env");

import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

export const query = async (text, params) => {
  if (process.env.NODE_ENV == "dev") {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", {
      text,
      params,
      duration,
      rows: res.rowCount,
    });
    return res;
  } else {
    return pool.query(text, params);
  }
};
