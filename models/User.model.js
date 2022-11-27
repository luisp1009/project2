const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        fullName: String,
        email: String,
        userName: String,
        password: String
    },
    {
        timestamps: true
    }
);

const User = model("User", userSchema);

module.exports = User;