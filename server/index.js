const express = require("express");
const app = express();
const mysql = require('mysql2/promise');
const cors = require("cors");
require('dotenv').config();
app.use(express.json());
app.use(cors)

async function initializeDatabase() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    console.log('Successfully connected to MySQL database!');
    return db; 
  } catch (error) {
    console.error('Failed to connect to MySQL:', error.message);
    process.exit(1);
  }
}

async function startServer() {
  const db = await initializeDatabase();

  app.get('/test-db', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM user LIMIT 1');
      res.json({ message: 'Database connected', data: rows });
    } catch (error) {
      res.status(500).json({ error: 'Database query failed', details: error.message });
    }
  });

  app.get('/getEvents' , async (req , res)=>{
    const [rows] = await db.query ('SELECT * FROM events')
    res.json({data:rows})
  })

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();