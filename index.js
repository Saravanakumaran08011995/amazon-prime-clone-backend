const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const movieRoute = require("./routes/movies")
const listRoute = require("./routes/lists")
const cors = require('cors')

app.use(cors())

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("db connected"))
.catch(err => console.log(err))

app.use(express.json())
app.get("/", (req, res)=>{
  res.send("Hello i'm working fine")
})
app.get("/api", (req, res)=>{
  res.send("Hello i'm api")
})
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute) 
app.use("/api/movies",movieRoute)
app.use("/api/lists",listRoute)


app.listen( 8800 , () => {
  console.log("server is up and running");
});
