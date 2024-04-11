const mongoose = require("mongoose");
const { db } = require("../models/User");

require("dotenv").config();


const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB Connect "))
    .catch((error) => {
        console.log("Error in DB Connect");
        console.error(error);
        process.exit(1);
    });
};

module.exports = dbConnect;
