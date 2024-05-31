// backend/models/userModel.js
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email address.`
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    }
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
