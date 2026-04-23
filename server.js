const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const DB_FILE = "./db.json";


// ==========================
// LOAD DATABASE
// ==========================
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}


// ==========================
// SAVE DATABASE
// ==========================
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}


// ==========================
// GENERATE TOKEN
// ==========================
function generateToken() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}


// ==========================
// ROOT (BIAR GA PUTIH)
// ==========================
app.get("/", (req, res) => {
  res.send(`
    <h2>🚀 SERVER TOKEN AKTIF</h2>
    <p>Cek user: /list</p>
    <p>Generate token: /generate?username=nama</p>
  `);
});


// ==========================
// LIST USER
// ==========================
app.get("/list", (req, res) => {
  const db = loadDB();
  res.json(db.users);
});


// ==========================
// LOGIN (VALIDASI TOKEN)
// ==========================
app.post("/login", (req, res) => {
  const { username, token } = req.body;
  const db = loadDB();

  const user = db.users.find(
    (u) => u.username === username && u.token === token
  );

  if (!user) {
    return res.json({
      status: "error",
      message: "Token tidak valid"
    });
  }

  res.json({
    status: "success",
    message: "Login berhasil",
    data: user
  });
});


// ==========================
// TAMBAH USER MANUAL
// ==========================
app.post("/add", (req, res) => {
  const { username } = req.body;
  const db = loadDB();

  const token = generateToken();

  db.users.push({
    username,
    token
  });

  saveDB(db);

  res.json({
    status: "success",
    username,
    token
  });
});


// ==========================
// GENERATE TOKEN (ADMIN)
// ==========================
app.get("/generate", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.send("Masukkan username");
  }

  const db = loadDB();
  const token = generateToken();

  db.users.push({
    username,
    token
  });

  saveDB(db);

  res.send(`
    <h3>Token berhasil dibuat</h3>
    <p>Username: ${username}</p>
    <p>Token: ${token}</p>

    <hr>
    <p>Gunakan untuk login:</p>
    <pre>
POST ${req.protocol}://${req.get("host")}/login
{
  "username": "${username}",
  "token": "${token}"
}
    </pre>
  `);
});


// ==========================
// PORT (WAJIB RAILWAY)
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
