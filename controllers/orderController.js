 const db = require('../config/db');

// PLACE ORDER
const placeOrder = (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ message: "User ID is required" });

    // Step 1 - Get all cart items for this user
    const getCartQuery = `
        SELECT cart.product_id, cart.quantity, products.price
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;
    db.query(getCartQuery, [user_id], (err, cartItems) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

        // Step 2 - Calculate total amount
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Step 3 - Create order
        const createOrderQuery = "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)";
        db.query(createOrderQuery, [user_id, totalAmount], (err, orderResult) => {
            if (err) return res.status(500).json({ message: "Error creating order" });

            const order_id = orderResult.insertId;

            // Step 4 - Add each cart item to order_items
            const orderItems = cartItems.map(item => [order_id, item.product_id, item.quantity, item.price]);
            const insertItemsQuery = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
            db.query(insertItemsQuery, [orderItems], (err) => {
                if (err) return res.status(500).json({ message: "Error saving order items" });

                // Step 5 - Clear cart after order placed
                const clearCartQuery = "DELETE FROM cart WHERE user_id = ?";
                db.query(clearCartQuery, [user_id], (err) => {
                    if (err) return res.status(500).json({ message: "Error clearing cart" });
                    res.status(201).json({
                        message: "Order placed successfully!",
                        order_id,
                        total_amount: totalAmount
                    });
                });
            });
        });
    });
};

// GET ALL ORDERS FOR A USER
const getUserOrders = (req, res) => {
    const { user_id } = req.params;
    const query = `
        SELECT orders.id, orders.total_amount, orders.status, orders.created_at
        FROM orders
        WHERE orders.user_id = ?
        ORDER BY orders.created_at DESC
    `;
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json(results);
    });
};

// GET SINGLE ORDER DETAILS
const getOrderDetails = (req, res) => {
    const { order_id } = req.params;
    const query = `
        SELECT order_items.id, products.name, products.image,
        order_items.quantity, order_items.price,
        (order_items.quantity * order_items.price) AS total_price
        FROM order_items
        JOIN products ON order_items.product_id = products.id
        WHERE order_items.order_id = ?
    `;
    db.query(query, [order_id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(results);
    });
};

module.exports = { placeOrder, getUserOrders, getOrderDetails };
