const express = require("express");
const app = express();

app.use(express.json());

// 🔐 Database sederhana
let users = [
  { username: "user1", token: "ABC123", used: false },
  { username: "user2", token: "XYZ789", used: false }
];

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

// 🔑 API LOGIN
app.post("/login", (req, res) => {
  const { username, token } = req.body;

  const user = users.find(
    u => u.username === username && u.token === token
  );

  if (!user) {
    return res.json({ message: "❌ Username / Token salah" });
  }

  if (user.used) {
    return res.json({ message: "❌ Token sudah dipakai" });
  }

  user.used = true;

  res.json({ message: "✅ Login berhasil (token aktif)" });
});

// PORT Railway
app.listen(process.env.PORT || 3000, () => {
  console.log("Server jalan");
});
