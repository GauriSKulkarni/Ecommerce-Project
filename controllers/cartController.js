const db = require('../config/db');

// ADD TO CART
const addToCart = (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id) {
        return res.status(400).json({ message: "User ID and Product ID are required" });
    }

    // Check if product already in cart
    const checkQuery = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
    db.query(checkQuery, [user_id, product_id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            // Update quantity if already exists
            const updateQuery = "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
            db.query(updateQuery, [quantity || 1, user_id, product_id], (err) => {
                if (err) return res.status(500).json({ message: "Error updating cart" });
                res.status(200).json({ message: "Cart updated successfully!" });
            });
        } else {
            // Add new item to cart
            const insertQuery = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
            db.query(insertQuery, [user_id, product_id, quantity || 1], (err) => {
                if (err) return res.status(500).json({ message: "Error adding to cart" });
                res.status(201).json({ message: "Product added to cart!" });
            });
        }
    });
};

// GET CART ITEMS
const getCart = (req, res) => {
    const { user_id } = req.params;
    const query = `
        SELECT cart.id, products.name, products.price, products.image, cart.quantity,
        (products.price * cart.quantity) AS total_price
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json(results);
    });
};

// REMOVE FROM CART
const removeFromCart = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM cart WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Cart item not found" });
        res.status(200).json({ message: "Item removed from cart!" });
    });
};

// CLEAR CART
const clearCart = (req, res) => {
    const { user_id } = req.params;
    const query = "DELETE FROM cart WHERE user_id = ?";
    db.query(query, [user_id], (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json({ message: "Cart cleared successfully!" });
    });
};

module.exports = { addToCart, getCart, removeFromCart, clearCart }; 
