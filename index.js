
const express = require("express");
const app = express();


const cookieParser = require("cookie-parser");
app.use(cookieParser());


//middleware
app.use(express.json());

//mounting
const auth = require("./routes/auth");
app.use("/api/v1", auth);


require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.get("/", (req,res) => {
    res.send(`<h1>This is homepage</h1>`)
})



const dbConnect = require("./config/database");
dbConnect();
