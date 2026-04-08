import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "name, email, password are required" });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  if (!validEmail(cleanEmail)) {
    return res.status(400).json({ success: false, message: "invalid email" });
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [cleanEmail]);
  if (existing.length) {
    return res.status(409).json({ success: false, message: "email already registered" });
  }

  const hash = await bcrypt.hash(String(password), 10);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [String(name).trim(), cleanEmail, hash]
  );

  return res.status(201).json({
    success: true,
    message: "user created",
    data: { id: result.insertId, name: String(name).trim(), email: cleanEmail },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "email and password are required" });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
    [cleanEmail]
  );

  if (!rows.length) {
    return res.status(401).json({ success: false, message: "invalid email or password" });
  }

  const user = rows[0];
  const ok = await bcrypt.compare(String(password), user.password_hash);

  if (!ok) {
    return res.status(401).json({ success: false, message: "invalid email or password" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: "JWT_SECRET missing" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

  return res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
