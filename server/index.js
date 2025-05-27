const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));

async function initializeDatabase() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  console.log("Connected to MySQL");
  return db;
}

async function startServer() {
  const db = await initializeDatabase();

  app.get("/getEvents", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM events");
    res.json({ data: rows });
  });

  app.get("/getUsers", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM user ORDER BY id DESC");
    res.json({ data: rows });
  });

  app.get("/getAdmins&members", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM user WHERE role IN ('member', 'admin') ORDER BY id DESC");
    res.json({ data: rows });
  });

  app.get("/getAllSubmission", async (req, res) => {
    const [rows] = await db.query("SELECT s.*, u.user_name FROM submission s JOIN user u ON s.user_id = u.id ORDER BY s.created_at");
    res.json({ data: rows });
  });

  app.get("/getPendingSubmission", async (req, res) => {
    const [rows] = await db.query("SELECT s.*, u.user_name FROM submission s JOIN user u ON s.user_id = u.id WHERE s.status = 'pending' ORDER BY s.created_at");
    res.json({ data: rows });
  });

  app.get("/getNews", async (req, res) => {
    const [rows] = await db.query("SELECT n.*, u.user_name FROM news n JOIN user u ON n.author_id = u.id");
    res.json({ data: rows });
  });

  app.post("/Login", async (req, res) => {
    const { user_name, password } = req.body;
    const [rows] = await db.query("SELECT * FROM user WHERE user_name = ?", [user_name]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "User not found" });
    if (user.password !== password) return res.status(401).json({ error: "Incorrect password" });
    res.json({ message: "Login successful", user: { id: user.id, user_name: user.user_name, role: user.role } });
  });

  app.post("/Register", async (req, res) => {
    const { user_name, password, email } = req.body;
    const [userRows] = await db.query("SELECT * FROM user WHERE user_name = ?", [user_name]);
    const [emailRows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (userRows[0]) return res.status(400).json({ error: "Username already exists" });
    if (emailRows[0]) return res.status(400).json({ error: "Email already exists" });
    await db.query("INSERT INTO user (email, password, user_name, role) VALUES (?, ?, ?, 'user')", [email, password, user_name]);
    res.json({ message: "Registration successful" });
  });

  app.delete("/DeleteEvent", async (req, res) => {
    const { id } = req.body;
    await db.query("DELETE FROM events WHERE id = ?", [id]);
    res.json({ message: "Event deleted" });
  });

  app.delete("/DeleteNews", async (req, res) => {
    const { id } = req.body;
    await db.query("DELETE FROM news WHERE id = ?", [id]);
    res.json({ message: "News deleted" });
  });

  app.post("/Submission", async (req, res) => {
    const { user_id, title, content } = req.body;
    await db.query("INSERT INTO submission (user_id, title, content) VALUES (?, ?, ?)", [user_id, title, content]);
    res.json({ message: "Submission complete" });
  });

  app.get("/UserSubmission", async (req, res) => {
    const { id } = req.query;
    const [rows] = await db.query("SELECT s.*, u.user_name FROM submission s JOIN user u ON s.user_id = u.id WHERE s.user_id = ?", [id]);
    res.json({ data: rows });
  });

  app.post("/ApproveSubmission", async (req, res) => {
    const { id } = req.body;
    const [rows] = await db.query("SELECT * FROM submission WHERE id = ?", [id]);
    const submission = rows[0];
    await db.query("UPDATE submission SET status = 'approved' WHERE id = ?", [id]);
    await db.query("INSERT INTO news (title, content, author_id) VALUES (?, ?, ?)", [submission.title, submission.content, submission.user_id]);
    res.json({ message: "Submission approved" });
  });

  app.post("/rejectSubmision", async (req, res) => {
    const { id } = req.body;
    await db.query("UPDATE submission SET status = 'rejected' WHERE id = ?", [id]);
    res.json({ message: "Submission rejected" });
  });

  app.post("/PromoteUser", async (req, res) => {
    const { id } = req.body;
    await db.query("UPDATE user SET role = 'member' WHERE id = ?", [id]);
    res.json({ message: "User promoted to member" });
  });

  app.post("/DemoteUser", async (req, res) => {
    const { id } = req.body;
    await db.query("UPDATE user SET role = 'user' WHERE id = ?", [id]);
    res.json({ message: "User demoted" });
  });

  app.post("/PromoteToAdmin", async (req, res) => {
    const { id } = req.body;
    await db.query("UPDATE user SET role = 'admin' WHERE id = ?", [id]);
    res.json({ message: "User promoted to admin" });
  });

  app.get("/GetEventComments", async (req, res) => {
    const { id } = req.query;
    const [rows] = await db.query("SELECT C.*, U.user_name, E.title FROM comment_event C JOIN user U ON C.user_id = U.id JOIN events E ON C.event_id = E.id WHERE E.id = ?", [id]);
    res.json({ data: rows });
  });

  app.get("/GetNewsComments", async (req, res) => {
    const { id } = req.query;
    const [rows] = await db.query("SELECT C.content, C.created_at, U.user_name, N.title FROM comment_event C JOIN user U ON C.user_id = U.id JOIN news N ON C.event_id = N.id WHERE N.id = ?", [id]);
    res.json({ data: rows });
  });

  app.post("/CommentOnEvent", async (req, res) => {
    const { user_id, event_id, content } = req.body;
    await db.query("INSERT INTO comment_event (user_id, event_id, content) VALUES (?, ?, ?)", [user_id, event_id, content]);
    res.json({ message: "Comment added" });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
