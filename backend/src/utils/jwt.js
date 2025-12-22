const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.SESSION_SECRET,
        { expiresIn: "7d" }
    );
}

module.exports = { generateToken };
