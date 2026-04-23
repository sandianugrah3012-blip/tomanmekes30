const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const DB_FILE = "./db.json";

//////////////////////////////
// LOAD DATABASE
//////////////////////////////
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

//////////////////////////////
// SAVE DATABASE
//////////////////////////////
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

//////////////////////////////
// GENERATE TOKEN
//////////////////////////////
function generateToken() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

//////////////////////////////
// ROOT
//////////////////////////////
app.get("/", (req, res) => {
  res.send("🚀 SERVER TOKEN AKTIF");
});

//////////////////////////////
// LIST USER
//////////////////////////////
app.get("/list", (req, res) => {
  const db = loadDB();
  res.json(db.users);
});

//////////////////////////////
// LOGIN (TOKEN 1x PAKAI)
//////////////////////////////
app.post("/login", (req, res) => {
  const { username, token } = req.body;
  const db = loadDB();

  const user = db.users.find(
    (u) => u.username === username && u.token === token
  );

  // ❌ token salah
  if (!user) {
    return res.json({
      status: "error",
      message: "Token tidak valid",
    });
  }

  // ❌ sudah dipakai
  if (user.used === true) {
    return res.json({
      status: "error",
      message: "Token sudah digunakan",
    });
  }

  // ✅ tandai sudah dipakai
  user.used = true;
  saveDB(db);

  res.json({
    status: "success",
    message: "Login berhasil (token aktif)",
  });
});

//////////////////////////////
// GENERATE TOKEN (ADMIN)
//////////////////////////////
app.get("/generate", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.send("Masukkan username");
  }

  const db = loadDB();
  const token = generateToken();

  db.users.push({
    username,
    token,
    used: false,
  });

  saveDB(db);

  res.send(`
    <h2>Token berhasil dibuat</h2>
    <p>Username: ${username}</p>
    <p>Token: ${token}</p>
  `);
});

//////////////////////////////
// PORT RAILWAY
//////////////////////////////
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
