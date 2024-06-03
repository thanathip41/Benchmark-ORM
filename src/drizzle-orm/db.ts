import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from './schema';

function logQuery(sql : string) {
  console.log(`Executing SQL: ${sql}`);
  // Alternatively, you can write to a file or any other logging mechanism
}

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD === '' ? "" : process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  pool : 10,
  connectionLimit : 151,
  charset : 'utf8',
  queueLimit : 0,
  waitForConnections : true
})

export const db = drizzle(poolConnection , { schema  , mode : 'default' , logger :  false });