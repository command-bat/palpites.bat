require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const app = express();

// 🔹 converter corretamente
const production = process.env.PRODUCTION === "true";

console.log("Está em produção?", production);

// 🔹 CORS
app.use(
    cors({
        origin: production
            ? ["https://palpites.commandbat.com.br"]
            : true,
        credentials: true,
    })
);

// 🔹 middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

// 🔹 trust proxy (APENAS boolean)
app.set("trust proxy", production);

// 🔹 rotas
app.get("/ping", (_req, res) => res.json({ pong: true }));

app.use("/auth", require("./routes/auth.routes"));
app.use("/matches", require("./routes/matches.routes"));
app.use("/users", require("./routes/users.routes"));

// 🔹 404
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

module.exports = app;
