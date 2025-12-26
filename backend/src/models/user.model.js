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

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        isPremium: {
            type: Boolean,
            default: false,
        },

        providers: {
            google: {
                id: { type: String },
            },
            discord: {
                id: { type: String },
                username: String,
                discriminator: String,
            },
        },

        lastLoginAt: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
