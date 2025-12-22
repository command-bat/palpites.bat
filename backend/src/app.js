const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

// =========================
// App
// =========================
const app = express();

app.set("trust proxy", true);

// =========================
// Passport config
// =========================
require("./config/passport");

// =========================
// Body parsers
// =========================
app.use((req, res, next) => {
    bodyParser.json()(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "400: Invalid JSON body" });
        }
        next();
    });
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _res, next) => {
    if (req.body === undefined || req.body === null) {
        req.body = {};
    }
    next();
});

// =========================
// CORS / Logs
// =========================
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// =========================
// Session + Passport
// ⚠️ Session SEMPRE antes do passport.session()
// =========================
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // true somente com HTTPS
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// =========================
// Routes
// =========================
app.get("/ping", (_req, res) => {
    res.json({ message: "Pong!", date: Date.now() });
});

app.use("/auth", require("./routes/auth.routes"));
app.use("/matches", require("./routes/matches.routes"));

// =========================
// 404
// =========================
app.use((_req, res) => {
    res.status(404).json({ message: "404: Route not found" });
});

module.exports = app;
