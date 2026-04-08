import { pool } from "../config/db.js";

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function addSchool(req, res) {
  const { name, address, latitude, longitude } = req.body;

  const lat = toNumber(latitude);
  const lng = toNumber(longitude);

  if (!name || !address || lat === null || lng === null) {
    return res.status(400).json({ success: false, message: "name, address, latitude, longitude are required" });
  }

  const [result] = await pool.query(
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
    [String(name).trim(), String(address).trim(), lat, lng]
  );

  return res.status(201).json({ success: true, id: result.insertId });
}

export async function listSchools(req, res) {
  const userLatitude = toNumber(req.query.latitude);
  const userLongitude = toNumber(req.query.longitude);

  const [rows] = await pool.query(
    "SELECT id, name, address, latitude, longitude FROM schools ORDER BY id DESC"
  );

  if (userLatitude === null || userLongitude === null) {
    return res.json({ success: true, data: rows });
  }

  const sorted = rows
    .map((school) => ({
      ...school,
      distance: Number(
        calculateDistanceKm(
          userLatitude,
          userLongitude,
          Number(school.latitude),
          Number(school.longitude)
        ).toFixed(3)
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  return res.json({ success: true, data: sorted });
}

export async function updateSchool(req, res) {
  const id = Number(req.params.id);
  const { name, address, latitude, longitude } = req.body;

  const lat = toNumber(latitude);
  const lng = toNumber(longitude);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "invalid id" });
  }

  if (!name || !address || lat === null || lng === null) {
    return res.status(400).json({ success: false, message: "name, address, latitude, longitude are required" });
  }

  const [result] = await pool.query(
    "UPDATE schools SET name = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?",
    [String(name).trim(), String(address).trim(), lat, lng, id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "School not found" });
  }

  return res.json({ success: true, message: "School updated" });
}

export async function deleteSchool(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "invalid id" });
  }

  const [result] = await pool.query("DELETE FROM schools WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "School not found" });
  }

  return res.json({ success: true, message: "School deleted" });
}
