// backend/middleware/requireAuth.js
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ message: 'Request is not authorized' });
    }
};

export default requireAuth;
