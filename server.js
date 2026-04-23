require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// ==============================
// TEST SERVER
// ==============================
app.get('/', (req, res) => {
  res.send('Server hidup 🔥')
})

// ==============================
// GENERATE TOKEN
// ==============================
function generateToken() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// ==============================
// BUAT TOKEN
// ==============================
app.get('/buat-token', (req, res) => {
  const token = generateToken()

  res.json({
    success: true,
    token: token
  })
})

// ==============================
// CEK TOKEN (dummy dulu)
// ==============================
app.get('/cek-token', (req, res) => {
  const { kode } = req.query

  if (!kode) {
    return res.json({
      success: false,
      pesan: 'Kode kosong'
    })
  }

  // sementara selalu valid
  res.json({
    success: true,
    pesan: 'Token valid (mode dummy)'
  })
})

// ==============================
// PORT SERVER
// ==============================
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`)
})
