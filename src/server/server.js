require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


const register = require("../routes/register");
const signin = require("../routes/signin");
const rank = require("../routes/rank");
const profile = require("../routes/Profile");
const forget = require("../routes/forget");
const resetPassword = require("../routes/resetPassword");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use("/register", register);
app.use("/signin", signin);
app.use("/rank", rank);
app.use("/profile", profile);
app.use("/forget", forget);
app.use("/resetPassword", resetPassword);

app.get("/", (reg, res) =>{
    res.status(200).json("yes");
});



app.listen(PORT, ()=>{
    console.log(`server listening at Port ${PORT}` )
})


