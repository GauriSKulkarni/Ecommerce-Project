 const db = require('../config/db');

// GET ALL PRODUCTS
const getAllProducts = (req, res) => {
    const query = "SELECT * FROM products";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json(results);
    });
};

// GET SINGLE PRODUCT BY ID
const getProductById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM products WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(results[0]);
    });
};

// ADD NEW PRODUCT
const addProduct = (req, res) => {
    const { name, description, price, image, stock } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
    }
    const query = "INSERT INTO products (name, description, price, image, stock) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [name, description, price, image, stock], (err, result) => {
        if (err) return res.status(500).json({ message: "Error adding product" });
        res.status(201).json({ message: "Product added successfully!", id: result.insertId });
    });
};

// DELETE PRODUCT
const deleteProduct = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM products WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully!" });
    });
};

module.exports = { getAllProducts, getProductById, addProduct, deleteProduct };
