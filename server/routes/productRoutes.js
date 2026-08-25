const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET all
router.get('/', async (req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});

// Get by id
router.get('/:id',async (req,res) => {
    try {
        const product = await Product.findOne({
            productId: req.params.id
        });
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
});

// create
router.post('/',async (req,res)=>{
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
});

//update
router.put('/:id',async(req,res)=>{
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            {productId: req.params.id},
            req.body,
            {
                returnDocument: "after", // new" true - old - deprecated
                runValidators: true
            });
        
            if(!updatedProduct){
                res.status(404).json({
                    message: "Product not found",
                });
            }
            res.status(200).json(updatedProduct);
    } catch (error) {
          res.status(400).json({
            message: "Failed to update product",
            error: error.message
        });
    }
});

//delete
router.delete('/:id',async(req,res)=>{
    try {
         const deletedProduct = await Product.findOneAndDelete(
        {productId: req.params.id}
    );
    if(!deletedProduct){
        res.status(404).json({ message: "Product not found"});
    }
    } catch (error) {
         res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
   
})

module.exports = router;
