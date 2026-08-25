const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    sku:{
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    salePrice: {
        type: Number,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
    },
    tags: {
        type: [String],
        default: [],
    },
    imageUrls: {
        type: [String],
        default: [],
    },
    stockQuantity:{
        type: Number,
        required: true,
        min: 0
    },
    specifications: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
},
{
    versionKey: false,
}
);

module.exports = mongoose.model("Product",productSchema);