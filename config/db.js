import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "school_db",
  port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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
