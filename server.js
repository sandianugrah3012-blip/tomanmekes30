// ================================
// IMPORT
// ================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// ================================
// SETUP APP
// ================================
const app = express();
app.use(cors());
app.use(express.json());

// ================================
// DATABASE (POSTGRES - RAILWAY)
// ================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ================================
// TEST SERVER
// ================================
app.get('/', (req, res) => {
  res.send('SERVER TOKEN AKTIF 🚀');
});

// ================================
// GENERATE TOKEN RANDOM
// ================================
function generateToken() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ================================
// BUAT TOKEN BARU
// ================================
app.get('/buat-token', async (req, res) => {
  const kode = generateToken();

  try {
    await pool.query(
      'INSERT INTO token (kode, status) VALUES ($1, true)',
      [kode]
    );

    res.json({
      success: true,
      kode: kode
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
});

// ================================
// CEK TOKEN (UNTUK APK)
// ================================
app.get('/cek-token', async (req, res) => {
  const { kode } = req.query;

  if (!kode) {
    return res.json({
      status: false,
      pesan: 'Kode kosong'
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM token WHERE kode = $1 AND status = true',
      [kode]
    );

    if (result.rows.length > 0) {
      res.json({
        status: true,
        pesan: 'Token valid'
      });
    } else {
      res.json({
        status: false,
        pesan: 'Token tidak valid'
      });
    }
  } catch (err) {
    res.json({
      status: false,
      error: err.message
    });
  }
});

// ================================
// NONAKTIFKAN TOKEN
// ================================
app.get('/disable-token', async (req, res) => {
  const { kode } = req.query;

  try {
    await pool.query(
      'UPDATE token SET status = false WHERE kode = $1',
      [kode]
    );

    res.json({
      success: true,
      pesan: 'Token dinonaktifkan'
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
});

// ================================
// LIST SEMUA TOKEN
// ================================
app.get('/list-token', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM token ORDER BY id DESC'
    );

    res.json(result.rows);
  } catch (err) {
    res.json({
      error: err.message
    });
  }
});

// ================================
// JALANKAN SERVER
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server jalan di port:', PORT);
});
