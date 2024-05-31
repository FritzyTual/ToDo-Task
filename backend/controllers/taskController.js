import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const sendMail = (email, subject, title, description) => {
    var transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'fritzy@tual25@gmail.com',
        to: email,
        subject: subject,
        html: `<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const addTask = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user._id;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newTask = new taskModel({ title, description, createdBy: userId, status: 'todo' });
        await newTask.save();
        sendMail(user.email, "Task Added", title, description);
        return res.status(200).json({ message: "Task added successfully", task: newTask });
    } catch (error) {
        console.error("Create Task Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const removeTask = async (req, res) => {
    const { id } = req.body;

    try {
        await taskModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getTask = async (req, res) => {
    try {
        const tasks = await taskModel.find({ createdBy: req.user._id });
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id, title, description } = req.body;

    try {
        const updatedTask = await taskModel.findByIdAndUpdate(id, { title, description }, { new: true });
        return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteTasksForUser = async (req, res) => {
    const { userId } = req.body;

    try {
        await taskModel.deleteMany({ createdBy: userId });
        return res.status(200).json({ message: "All tasks for the user deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { addTask, getTask, removeTask, updateTask, deleteTasksForUser };
