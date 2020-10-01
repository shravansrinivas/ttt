//Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config();
//Routes import
const sampleRoutes = require("./routes/Game");


const app = express();

//React APP
app.use(express.static('react-client/build'));

//Midleware
app.use(bodyparser.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Routes
app.use("/api/games", sampleRoutes);
app.get("/api", (req,res)=>{
  res.send('This is a simple express API for tit-tac-toe match management');
})

//server

const PORT_NUM=process.env.PORT;
app.listen(process.env.PORT || 3000)
console.log("Express.js Server started on "+PORT_NUM);