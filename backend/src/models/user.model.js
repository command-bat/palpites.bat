const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        name: String,
        avatar: String,

        providers: {
            google: {
                id: String,
            },
            discord: {
                id: String,
                username: String,
                discriminator: String,
            },
        },

        lastLoginAt: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
