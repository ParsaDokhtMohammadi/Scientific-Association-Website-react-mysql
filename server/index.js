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

  // Event Queries
  app.get("/getEvents", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM events");
    res.json({ data: rows });
  });

  app.get("/singleEventData", async (req, res) => {
    const { id } = req.query;
    const [row] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    res.json({ data: row });
  });
  app.get("/singleNewsData", async (req , res)=>{
    const {id} = req.query
    const [rows] = await db.query("select n.* , u.user_name from news n join user u on u.id = n.author_id where n.id = ?" , [id])
    res.json({data:rows})
  })

  app.delete("/DeleteEvent", async (req, res) => {
    const { id } = req.body;
    await db.query("DELETE FROM events WHERE id = ?", [id]);
    res.json({ message: "Event deleted" });
  });

  // User Queries
  app.get("/getUsers", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM user ORDER BY id DESC");
    res.json({ data: rows });
  });

  app.get("/getAdmins&members", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM user WHERE role IN ('member', 'admin') ORDER BY id DESC");
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

  // Registration & Capacity Handling
  app.get("/Registration", async (req, res) => {
    const { id } = req.query;
    const [rows] = await db.query("SELECT * FROM event_registration WHERE user_id = ?", [id]);
    res.json({ data: rows });
  });
  app.get("/AllRegistration" , async (req,res)=>{
    const {id} = req.query
    const [rows] = await db.query("select * from events e left join event_registration er on e.id = er.event_id where er.user_id = ?",[id])
    res.json({data:rows})
  })

  app.post("/registerForEvent", async (req, res) => {
    const { event_id, user_id } = req.body;
    try {
      await db.query("CALL RegisterUserForEvent(?, ?)", [event_id, user_id]);
      res.json({ message: "Registration successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/unRegister", async (req, res) => {
    const { event_id, user_id } = req.body;
    try {
      await db.query("CALL UnregisterUserFromEvent(?, ?)", [event_id, user_id]);
      res.json({ message: "Unregistration successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Unregistration failed" });
    }
  });

  // Submission & Approval Flow
  app.get("/getAllSubmission", async (req, res) => {
    const [rows] = await db.query("SELECT s.*, u.user_name FROM submission s JOIN user u ON s.user_id = u.id ORDER BY s.created_at");
    res.json({ data: rows });
  });

  app.get("/getPendingSubmission", async (req, res) => {
    const [rows] = await db.query("SELECT s.*, u.user_name FROM submission s JOIN user u ON s.user_id = u.id WHERE s.status = 'pending' ORDER BY s.created_at");
    res.json({ data: rows });
  });
  app.post("/CreateEvent", async (req, res) => {
    const { title, description, date, presenter, capacity } = req.body;
    try {
        await db.query(
            "INSERT INTO events (title, description, date, presenter, capacity) VALUES (?, ?, ?, ?, ?)",
            [title, description, date, presenter, capacity]
        );
        res.json({ message: "Event created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating event" });
    }
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

  // News Management
  app.get("/getNews", async (req, res) => {
    const [rows] = await db.query("SELECT n.*, u.user_name FROM news n JOIN user u ON n.author_id = u.id");
    res.json({ data: rows });
  });

  app.delete("/DeleteNews", async (req, res) => {
    const { id } = req.body;
    await db.query("DELETE FROM news WHERE id = ?", [id]);
    res.json({ message: "News deleted" });
  });

  // User Role Management
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

  // Comments
  app.get("/GetEventComments", async (req, res) => {
    const { id } = req.query;
    const [rows] = await db.query("SELECT C.*, U.user_name, E.title FROM comment_event C JOIN user U ON C.user_id = U.id JOIN events E ON C.event_id = E.id WHERE E.id = ?", [id]);
    res.json({ data: rows });
  });

  app.get("/GetNewsComments", async (req, res) => {
    const { id } = req.query;
    const [rows] = await db.query("SELECT c.*, u.user_name FROM comment_news c JOIN user u ON u.id = c.user_id WHERE c.news_id = ?;", [id]);
    res.json({ data: rows });
  });

  app.post("/CommentOnEvent", async (req, res) => {
    const { user_id, event_id, content } = req.body;
    await db.query("INSERT INTO comment_event (user_id, event_id, content) VALUES (?, ?, ?)", [user_id, event_id, content]);
    res.json({ message: "Comment added" });
  });

  app.post("/CommentOnNews", async (req, res) => {
    const { user_id, news_id, content } = req.body;
    await db.query("INSERT INTO comment_news (user_id, news_id, content) VALUES (?, ?, ?)", [user_id, news_id, content]);
    res.json({ message: "Comment added" });
  });
  app.delete("/DeleteEventComment" , async (req,res)=>{
    const {id} = req.query
    await db.query("DELETE from comment_event where id = ?" , [id])
    res.json({message:"comment deleted"})
  })
  app.delete("/DeleteNewsComment" , async (req,res)=>{
    const {id} = req.query
    await db.query("DELETE from comment_news where id = ?" , [id])
    res.json({message:"comment deleted"})
  })
  app.put("/EditEvent", async (req, res) => {
    const { id, title, description, date, capacity, presenter, img_path } = req.body;

    try {
        await db.query(
            "UPDATE events SET title = ?, description = ?, date = ?, capacity = ?, presenter = ?, img_path = ? WHERE id = ?",
            [title, description, date, capacity, presenter, img_path, id]
        );
        res.json({ message: "Event updated successfully" });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Error updating event" });
    }
});
app.put("/EditNews", async (req, res) => {
    const { id, title, content, img_path } = req.body;

    try {
        await db.query(
            "UPDATE news SET title = ?, content = ?, img_path = ? WHERE id = ?",
            [title, content, img_path, id]
        );
        res.json({ message: "News updated successfully" });
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Error updating news" });
    }
});

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
