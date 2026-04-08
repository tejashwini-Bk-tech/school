import mysql from "mysql2/promise";

const pool = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});


export async function verifyConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log("MySQL connected");
  } finally {
    connection.release();
  }
}

export async function closePool() {
  await pool.end();
}

export { pool };
