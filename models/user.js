const mongoose = require('mongoose');
const path = require('path');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/profileImages/default.jpg",
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;