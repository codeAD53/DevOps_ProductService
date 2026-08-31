const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require('./app');

dotenv.config({path: "../.env"});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(()=>{
        console.log("Mongo DB connected successfully");
        app.listen(PORT,() => console.log(`Server running on PORT ${PORT}`));
    })
    .catch((error)=>console.error("MongoDB connection failed", error.message));
