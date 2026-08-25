const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
dotenv.config({path: "../.env"});

const productsPath = path.join(__dirname, "../data/products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log(`${products.length} products inserted successfully`);
        await mongoose.connection.close();

        console.log("MongoDB connection closed");

    } catch (error) {
        console.error("Seeding failed",error.message);
        process.exit(1);
    }
};
seedDatabase();