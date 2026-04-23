const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const DB_FILE = "./db.json";

// ============================
// LOAD DATABASE
// ============================
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// ============================
// SAVE DATABASE
// ============================
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ============================
// GENERATE TOKEN RANDOM
// ============================
function generateToken() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

// ============================
// HALAMAN ROOT (BIAR GAK ERROR)
// ============================
app.get("/", (req, res) => {
  res.send("SERVER TOKEN AKTIF 🚀");
});

// ============================
// LOGIN (VALIDASI TOKEN)
// ============================
app.post("/login", (req, res) => {
  const { username, token } = req.body;

  const db = loadDB();

  const user = db.users.find(
    (u) => u.username === username && u.token === token
  );

  if (!user) {
    return res.json({
      status: "error",
      message: "Token tidak valid",
    });
  }

  // TANPA EXPIRED & TANPA LIMIT
  res.json({
    status: "success",
    message: "Login berhasil",
    data: user,
  });
});

// ============================
// TAMBAH USER MANUAL
// ============================
app.post("/add", (req, res) => {
  const { username, token } = req.body;

  const db = loadDB();

  db.users.push({
    username,
    token,
  });

  saveDB(db);

  res.json({
    status: "success",
    message: "User ditambahkan",
  });
});

// ============================
// GENERATE TOKEN OTOMATIS
// ============================
app.get("/generate", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.json({ message: "Username wajib" });
  }

  const db = loadDB();

  const token = generateToken();

  db.users.push({
    username,
    token,
  });

  saveDB(db);

  res.json({
    status: "success",
    username,
    token,
  });
});

// ============================
// LIST USER
// ============================
app.get("/list", (req, res) => {
  const db = loadDB();
  res.json(db.users);
});

// ============================
// HAPUS USER
// ============================
app.delete("/delete", (req, res) => {
  const { username } = req.body;

  let db = loadDB();

  db.users = db.users.filter((u) => u.username !== username);

  saveDB(db);

  res.json({
    status: "success",
    message: "User dihapus",
  });
});

// ============================
// START SERVER
// ============================
app.listen(process.env.PORT || 3000, () => {
  console.log("Server jalan 🚀");
});
