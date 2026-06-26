 
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// REGISTER
const register = (req, res) => {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const checkEmail = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmail, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Encrypt password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Save user to database
        const insertUser = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(insertUser, [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: "Error creating user" });
            res.status(201).json({ message: "User registered successfully!" });
        });
    });
};

// LOGIN
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const findUser = "SELECT * FROM users WHERE email = ?";
    db.query(findUser, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];

        // Check password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
};

module.exports = { register, login };