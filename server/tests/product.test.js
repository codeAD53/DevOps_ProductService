const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require('../app')
const Product = require("../models/Product");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create(); // it creates temp mongoDB
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    await Product.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Product API", () => {
    test("GET /api/products should return an empty array initially", async () => {
        const response = await request(app).get("/api/products");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("POST /api/products should create a new product",async () => {
        const newProduct = {
            productId: "PROD-TEST-001",
            sku: "SKU-TEST-001",
            name: "Test Smartphone",
            brand: "TestBrand",
            price: 499.99,
            currency: "USD",
            category: "Electronics",
            stockQuantity: 10
        };
        const response = await request(app).post("/api/products").send(newProduct);

        expect(response.statusCode).toBe(201);
        expect(response.body.productId).toBe("PROD-TEST-001");
        expect(response.body.name).toBe("Test Smartphone");
    });

    test("GET /api/products/:id should return a product by productId", async () => {
        const product = {
            productId: "PROD-TEST-002",
            sku: "SKU-TEST-002",
            name: "Test Laptop",
            brand: "TestBrand",
            price: 999.99,
            currency: "USD",
            category: "Electronics",
            stockQuantity: 4
        };
        await Product.create(product);
        const response = await request(app).get("/api/products/PROD-TEST-002");

        expect(response.statusCode).toBe(200);
        expect(response.body.productId).toBe("PROD-TEST-002");
        expect(response.body.name).toBe("Test Laptop");
        
    });

    test("GET /api/products/:id should return 404 for a non-existent product",async () => {
        const response = await request(app).get("/api/products/DOES-NOT-EXIST");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Product not found");
    });

    test("POST /api/products should reject a product with missing required fields", async () => {
        const invaildProduct = {
            name: "Invalid Product",
            price: 100
        };

        const response = await request(app).post("/api/products").send(invaildProduct);

        expect(response.statusCode).toBe(400);
    });

    test("POST /api/products should reject a product with a negative price", async () => {
        const invalidProduct = {
         productId: "PROD-INVALID-001",
        sku: "SKU-INVALID-001",
        name: "Invalid Product",
        brand: "TestBrand",
        price: -100,
        currency: "USD",
        category: "Electronics",
        stockQuantity: 10
        };
        const response = await request(app).post('/api/products').send(invalidProduct);
        expect(response.statusCode).toBe(400);
    });

    test("PUT /api/products/:id should update an existing product", async () => {
        const product = {
       productId: "PROD-TEST-003",
        sku: "SKU-TEST-003",
        name: "Original Laptop",
        brand: "TestBrand",
        price: 999.99,
        currency: "USD",
        category: "Electronics",
        stockQuantity: 5
        };
        await Product.create(product);
        const response = await request(app).put('/api/products/PROD-TEST-003').send({
            name: "Updated Laptop",
            price: 788.4
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe("Updated Laptop");
        expect(response.body.price).toBe(788.4);
    });

    test("PUT /api/products/:id should return 404 for a non-existent product",async() => {
        const response = await request(app).put("/api/products/DOES-NOT-EXIST").send({
            name: "VMs",
            price: 1400
        });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(
            "Product not found"
        );
    });

    test("DELETE /api/products/:id should delete an existing product",async() => {
          const product = {
        productId: "PROD-TEST-004",
        sku: "SKU-TEST-004",
        name: "Test Headphones",
        brand: "TestBrand",
        price: 149.99,
        currency: "USD",
        category: "Electronics",
        stockQuantity: 10
    };
    await Product.create(product);
        const response = await request(app).delete("/api/products/PROD-TEST-004");

        expect(response.statusCode).toBe(200);
        const deletedProduct = await Product.findOne({
            productId: "PROD-TEST-004"
        });
        expect(deletedProduct).toBeNull();
    });

    test("DELETE /api/products/:id should return 404 for a non-existent product",async() => {
        const response = await request(app).delete("/api/products/DOES-NOT-EXIST");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(
            "Product not found"
        );
    });
});
