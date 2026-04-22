const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

const tokens = [
  "12345",
  "toman30",
  "user001",
  "premium123"
];

app.get("/", (req, res) => {
  res.send("Server Token Aktif");
});

app.get("/check", (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.json({
      status: "error",
      message: "token tidak dikirim"
    });
  }

  if (tokens.includes(token)) {
    return res.json({
      status: "valid",
      token: token
    });
  } else {
    return res.json({
      status: "invalid",
      token: token
    });
  }
});

app.listen(port, () => {
  console.log("Server jalan di port " + port);
});
