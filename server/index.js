const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use('/uploads', express.static('uploads'));
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });




async function startServer() {
  const db = await initializeDatabase();
  
  // Event Queries
  app.get("/getEvents", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM events order by created_at desc");
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
  app.post("/CreateEvent", upload.single("image"), async (req, res) => {
  const { title, description, date, presenter, capacity } = req.body;
  const img_path = req.file ? `/uploads/${req.file.filename}` : '/uploads/defaults/eventDefault.webp';
  try {
    await db.query(
      "INSERT INTO events (title, description, date, presenter, capacity, img_path) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, date, presenter, capacity, img_path]
    );
    res.json({ message: "Event created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating event" });
  }
});
app.post("/CreateNews",upload.single("img") , async (req , res)=>{
  const {title , content , author_id} = req.body
  const img_path = req.file ? `/uploads/${req.file.filename}` : '/uploads/defaults/blogDefault.webp'
  await db.query("insert into news (title , content , author_id , img_path) VALUES(?,?,?,?)",[title , content , author_id , img_path])
  res.json({ message: "news created successfully" });

})
app.post("/Submission", upload.single("image"), async (req, res) => {
    const { user_id, title, content } = req.body;
    const img_path = req.file ?  `/uploads/${req.file.filename}` : '/uploads/defaults/blogDefault.webp'; 

    try {
        await db.query(
            "INSERT INTO submission (user_id, title, content, img_path) VALUES (?, ?, ?, ?)",
            [user_id, title, content, img_path]
        );
        res.json({ message: "Submission complete" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating submission" });
    }
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
    await db.query("INSERT INTO news (title, content, author_id, img_path) VALUES (?, ?, ?, ?)",[submission.title, submission.content, submission.user_id, submission.img_path]);
    res.json({ message: "Submission approved" });
  });

  app.post("/rejectSubmision", async (req, res) => {
    const { id } = req.body;
    await db.query("UPDATE submission SET status = 'rejected' WHERE id = ?", [id]);
    res.json({ message: "Submission rejected" });
  });
  app.get("/GetSubmissionById", async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "Missing submission ID" });

    try {
        const [rows] = await db.query('SELECT s.*, u.user_name FROM submission s JOIN user u ON u.id = s.user_id WHERE s.id = ?',[id]);
        res.json({ data: rows[0] });
    } catch (error) {
        console.error("Error fetching submission by ID:", error);
        res.status(500).json({ message: "Error fetching submission" });
    }
});
  // News Management
  app.get("/getNews", async (req, res) => {
    const [rows] = await db.query("SELECT n.*, u.user_name FROM news n JOIN user u ON n.author_id = u.id order by created_at desc");
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
 app.put("/EditEvent", upload.single("img"), async (req, res) => {
    const { id, title, description, date, capacity, presenter } = req.body;
    let img_path = req.body.img_path;
    try {
        if (req.file) {
            img_path = `/uploads/${req.file.filename}`;
            const [rows] = await db.query("SELECT img_path FROM events WHERE id = ?", [id]);
            if (rows.length > 0 && rows[0].img_path && rows[0].img_path !== '/uploads/defaults/eventDefault.webp') {
                const oldImagePath = path.join(__dirname, rows[0].img_path);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old event image:", err);
                });
            }
        }
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
app.put("/EditNews", upload.single("img"), async (req, res) => {
    const { id, title, content } = req.body;
    let img_path = req.body.img_path;

    try {

        if (req.file) {
            img_path = `/uploads/${req.file.filename}`;
            const [rows] = await db.query("SELECT img_path FROM news WHERE id = ?", [id]);
            if (rows.length > 0 && rows[0].img_path && rows[0].img_path !== '/uploads/defaults/blogDefault.webp') {
                const oldImagePath = path.join(__dirname, rows[0].img_path);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }
        }
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
app.put("/updateUser", async (req, res) => {
  const { user_name, email, password } = req.body;
  const { id } = req.query;
  try {
    await db.query(
      "UPDATE user SET user_name = ?, email = ?, password = ? WHERE id = ?",
      [user_name, email, password, id]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

app.get("/getUser", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Missing user ID" });
  try {
    const [user] = await db.query("SELECT id, email, user_name, role, created_at FROM user WHERE id = ?", [id]);
    res.json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});
app.delete("/deleteSubmission", async (req , res)=>{
  const {id} = req.query
  try{
    await db.query("delete from submission where id = ?", [id])
    res.json({message:"deleted"})
  }
  catch(err){
    console.log(err)
    res.status(500).json({message:"server error"})
  }
})

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();

//  tests 

if (process.argv[2] === "test") {
  const request = require("supertest");

  (async () => {
    try {
      console.log("Running API tests...");

      await new Promise((r) => setTimeout(r, 1000));

      console.log("Test 1: GET /getEvents");
      let res = await request(app).get("/getEvents");
      if (res.status !== 200) throw new Error("GET /getEvents failed");

      console.log("Test 2: GET /getUsers");
      res = await request(app).get("/getUsers");
      if (res.status !== 200) throw new Error("GET /getUsers failed");

      console.log("Test 3: POST /Login with bad credentials");
      res = await request(app).post("/Login").send({ user_name: "wronguser", password: "wrongpass" });
      if (res.status !== 401) throw new Error("POST /Login bad credentials test failed");

      console.log("Test 4: POST /Register with empty fields");
      res = await request(app).post("/Register").send({ user_name: "", password: "", email: "" });
      if (![400, 500].includes(res.status)) throw new Error("POST /Register invalid data test failed");

      console.log("Test 5: GET /getAdmins&members");
      res = await request(app).get("/getAdmins&members");
      if (res.status !== 200) throw new Error("GET /getAdmins&members failed");

      console.log("Test 6: GET /singleEventData with invalid ID");
      res = await request(app).get("/singleEventData").query({ id: -1 });
      if (res.status !== 200) throw new Error("GET /singleEventData with invalid id failed");

      console.log("Test 7: POST /registerForEvent with dummy data");
      res = await request(app).post("/registerForEvent").send({ event_id: 1, user_id: 1 });
      if (![200, 500].includes(res.status)) throw new Error("POST /registerForEvent failed");

      console.log("Test 8: GET /getNews");
      res = await request(app).get("/getNews");
      if (res.status !== 200) throw new Error("GET /getNews failed");

     
      console.log("Test 9: GET /UserSubmission with dummy user id");
      res = await request(app).get("/UserSubmission").query({ id: 1 });
      if (res.status !== 200) throw new Error("GET /UserSubmission failed");

      console.log("✅ All tests passed!");
      process.exit(0);
    } catch (err) {
      console.error("❌ Tests failed:", err.message);
      process.exit(1);
    }
  })();
}
