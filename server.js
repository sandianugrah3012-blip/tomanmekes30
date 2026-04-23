const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

// 📁 Simpan ke file biar tidak hilang
const DB_FILE = "db.json";

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// 🔑 Generate token random
function generateToken() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// 🌐 Halaman login
app.get("/", (req, res) => {
  res.send(`
    <h2>LOGIN TOKEN</h2>
    <input id="username" placeholder="Username"/><br><br>
    <input id="token" placeholder="Token"/><br><br>
    <button onclick="login()">Login</button>
    <p id="result"></p>

    <script>
      async function login() {
        const username = document.getElementById("username").value;
        const token = document.getElementById("token").value;

        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, token })
        });

        const data = await res.json();
        document.getElementById("result").innerText = data.message;
      }
    </script>
  `);
});

// 🔑 LOGIN
app.post("/login", (req, res) => {
  const { username, token } = req.body;
  const db = loadDB();

  const user = db.users.find(
    u => u.username === username && u.token === token
  );

  if (!user) {
    return res.json({ message: "❌ Username / Token salah" });
  }

  if (user.used) {
    return res.json({ message: "❌ Token sudah dipakai" });
  }

  if (Date.now() > user.expired) {
    return res.json({ message: "❌ Token expired" });
  }

  user.used = true;
  saveDB(db);

  res.json({ message: "✅ Login berhasil (token aktif)" });
});

// 🎟️ GENERATE TOKEN (ADMIN)
app.get("/generate", (req, res) => {
  const { username, days } = req.query;

  if (!username) {
    return res.json({ message: "Username wajib" });
  }

  const db = loadDB();
  const token = generateToken();

  const expired = Date.now() + (days || 1) * 24 * 60 * 60 * 1000;

  db.users.push({
    username,
    token,
    used: false,
    expired
  });

  saveDB(db);

  res.json({
    username,
    token,
    expired: new Date(expired)
  });
});

// PORT
app.listen(process.env.PORT || 3000, () => {
  console.log("Server jalan");
});
