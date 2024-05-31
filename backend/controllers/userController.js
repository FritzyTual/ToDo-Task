// backend/controllers/userController.js
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator"; // Import validator library for email validation

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60 // Token expires in 3 days
    });
};

// Register user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate email using validator library
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }

        // Validate password strength using validator library
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Please enter a strong password" });
        }

        // Check if username is provided
        if (!username) {
            return res.status(400).json({ message: "Please enter a username" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await userModel.create({ username, email, password: hashedPassword });

        // Generate JWT token
        const token = createToken(newUser._id);

        // Respond with user info and token
        res.status(200).json({ user: newUser, token });
    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern.email) {
                return res.status(400).json({ message: "Email address is already in use" });
            } else if (error.keyPattern.username) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }
        console.error("Register Error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate email
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }

        // Validate password
        if (!password) {
            return res.status(400).json({ message: "Please enter your password" });
        }

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = createToken(user._id);

        // Respond with user info and token
        res.status(200).json({ user, token });
    } catch (error) {
        console.error("Login Error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get user info
const getUser = async (req, res) => {
    const id = req.user.id;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Get User Error: ", error);
        res.status(502).json({ message: "Internal Server Error" });
    }
};

export { registerUser, getUser, loginUser };
