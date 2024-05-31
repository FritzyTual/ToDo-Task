// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // Import Nodemailer

import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 8001;
mongoose.set('strictQuery', true);

// Middlewares
app.use(express.json());
app.use(cors());

// DB config
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log("DB Connected");
    }
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME, // Your email username
        pass: process.env.EMAIL_PASSWORD, // Your email password
    },
});

// API endpoints
app.use("/api/user", userRouter); // Ensure the route prefixes match
app.use("/api/task", taskRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);

// Listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
