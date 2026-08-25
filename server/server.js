const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
const productRoutes = require("./routes/productRoutes");

dotenv.config({path: "../.env"});

const app = express();
app.use(express.json());
app.use("/api/products",productRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;



mongoose
    .connect(MONGO_URI)
    .then(()=>{
        console.log("Mongo DB connected successfully");
        app.listen(PORT,() => console.log(`Server running on PORT ${PORT}`));
    })
    .catch((error)=>console.error("MongoDB connection failed", error.message));

app.get('/',(req,res)=>{
    res.json({message:
            "Product catalog microservice is running"
    });
});

