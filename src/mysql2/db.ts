import mysql from "mysql2/promise";

export const db = mysql.createPool({
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
