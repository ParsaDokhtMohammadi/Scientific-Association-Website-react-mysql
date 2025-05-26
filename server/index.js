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
    const [rows] = await db.query("SELECT * FROM user order by id desc")
    res.json({data:rows})
  }) 
  app.get("/getAdmins&members" , async (req , res)=>{
    const [rows] = await db.query("SELECT * FROM user where role = 'member' or role = 'admin' order by id desc")
    res.json({data:rows})
  }) 
  app.get("/getAllSubmission", async (req , res)=>{
    const [rows] = await db.query("SELECT s.*, u.user_name FROM submission s JOIN user u ON s.user_id = u.id order by s.created_at")
    res.json({data:rows})
  })
  app.get("/getPendingSubmission", async (req , res)=>{
    const [rows] = await db.query("SELECT s.*, u.user_name FROM submission s JOIN user u ON s.user_id = u.id where s.status = 'pending' order by s.created_at")
    res.json({data:rows})
  })

  app.get("/getNews" , async (req , res)=>{
    try{
      const [rows] = await db.query("select n.* ,u.user_name from news n join user u on n.author_id = u.id;")
      res.json({data:rows})
    }
    catch (error){
       console.error('Error in /getEvents:', error.message);
      res.status(500).json({ error: 'Query failed', details: error.message });
    }
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
  app.post("/Register" , async (req ,res)=>{
    try{
      const {user_name , password , email} = req.body
    const [rows] = await db.query("SELECT * FROM user where user_name = ?",[user_name])
    const [rows2] = await db.query("select email from user where email = ?" , [email])
    const user = rows[0]
    const UserEmail = rows2[0]
    if(user){
      return res.status(400).json({error:"user already exists"})
    }
    if (UserEmail){
      return res.status(400).json({error:"a user with this email already exists"})
    }
    await db.query("insert into user (email ,password,user_name,role) values(?,?,?,?)",[email,password,user_name,"user"])
    res.json({
      message : "register successful",
     
    })
    }
    catch (error){
      console.error('Error in /Register:', error.message);
      res.status(500).json({ error: 'Query failed', details: error.message });
    }
  })

app.delete("/DeleteEvent", async (req, res) => {
  try {
    const { id } = req.body;

   

    await db.query("DELETE FROM events WHERE id = ?", [id]);

    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

app.delete("/DeleteNews" , async(req , res)=>{
  try{
    const {id} = req.body
    await db.query("Delete from news where id = ?",[id])
    res.json({message:"news deleted"})
  }
  catch (error){
    console.error("error deleting news" , error)
    res.status(500).json({error:"internal server error"})
  }

})
app.post("/Submission" , async(req , res)=>{
  try{
   const {user_id ,title , content} = req.body 
   await db.query("insert into Submission (user_id , title , content) values (?,?,?);" , [user_id,title,content])
   res.json({message:"submission complete"})
  }
  catch(error){
    console.error("error submiting" , error)
    res.status(500).json({error:"internal server error"})
  }
})  
app.get("/UserSubmission", async (req, res) => {
  const userId = req.query.id;
  try {
    const [rows] = await db.query(
      "SELECT s.*, u.user_name FROM submission s JOIN user u ON s.user_id = u.id WHERE s.user_id = ?",
      [userId]
    );
    res.json({ data: rows });
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/ApproveSubmission", async (req, res) => {
  const { id } = req.body;

  try {
    const [submissionRows] = await db.query("SELECT * FROM submission WHERE id = ?", [id]);
    const submission = submissionRows[0];
    await db.query("UPDATE submission SET status = 'approved' WHERE id = ?", [id]);
    await db.query(
      "INSERT INTO news (title, content, author_id) VALUES (?, ?, ?)",
      [submission.title, submission.content, submission.user_id]
    );

    res.json({ message: "Submission approved and added to news" });
  } catch (error) {
    console.error("Error approving submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/rejectSubmision" , async (req , res)=>{
  const {id} = req.body
  try{
    await db.query("UPDATE submission SET status = 'rejected' where id = ?",[id])
    res.json({message:"submission rejected"})
  }
  catch(error){
    console.log("error rejecting",error)
    res.status(500).json({error:"internal server error"})
  }
})
app.post("/PromoteUser" , async(req , res)=>{
  const {id} = req.body
  try{
    await db.query("UPDATE user set role = 'member' where id = ?",[id])
    res.json({message:"user Promoted to member"})
  } 
  catch(error){
    console.log("error promoting user" , error)
    res.status(500).json({error:"internal server error"})
  }
})
app.post("/DemoteUser" , async(req , res)=>{
  const {id} = req.body
  try{
    await db.query("UPDATE user set role = 'user' where id = ?",[id])
    res.json({message:"user demoted"})
  } 
  catch(error){
    console.log("error demoting user" , error)
    res.status(500).json({error:"internal server error"})
  }
})
app.post("/PromoteToAdmin" , async(req , res)=>{
  const {id} = req.body
  try{
    await db.query("UPDATE user set role = 'admin' where id = ?",[id])
    res.json({message:"user promoted to admin"})
  } 
  catch(error){
    console.log("error promoting user" , error)
    res.status(500).json({error:"internal server error"})
  }
})
app.get("/GetEventComents" , async(req,res)=>{
  const event_id = req.query.id
  try{
    const [rows] = await db.query("select C.* ,  U.user_name , E.title from comment_event C join user U on U.id = C.user_id join events E on C.event_id = E.id  where E.id = ?;", [event_id])
    res.json({data:rows})
  }
  catch(error){

  }
})
app.get("/GetNewsComents" , async(req,res)=>{
  const news_id = req.query.id
  try{
    const [rows] = await db.query("select C.* ,  U.user_name , N.title from comment_event C join user U on U.id = C.user_id join news N on C.event_id = E.id  where N.id = ?;", [news_id])
    res.json({data:rows})
  }
  catch(error){

  }
})

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
}


startServer();