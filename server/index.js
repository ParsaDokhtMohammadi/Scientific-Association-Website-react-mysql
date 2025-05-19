const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

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
    throw error;
  }
}

async function startServer() {
  let db;
  try {
    db = await initializeDatabase();
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }


  // Events route
  app.get('/getEvents', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM events');
      res.json({ data: rows });
    } catch (error) {
      console.error('Error in /getEvents:', error.message);
      res.status(500).json({ error: 'Query failed', details: error.message });
    }
  });

  app.get("/getUsers" , async (req , res)=>{
    const [rows] = await db.query("SELECT * FROM user")
    res.json({data:rows})
  }) 

  app.get("/getNews" , async (req , res)=>{
    const [rows] = db.query("SELECT * FROM news")
    res.json({data:rows})
  })

  app.post("/Login" , async (req , res)=>{
    const {user_name , password} = req.body
    const [rows] = await db.query("SELECT * FROM user where user_name = ?",[user_name])
    const user = rows[0]
    if(!user){
      return res.status(401).json({error:"user does not exist"})
    }
    else if (user.password!==password){
      return res.status(401).json({error:"password is incorect"})
    }
    res.json({
      message: 'Login successful',
      user: { id: user.id, user_name: user.user_name, role: user.role },
    });
  })



  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();