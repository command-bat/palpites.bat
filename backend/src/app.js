require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

app.get("/ping", (_req, res) => res.json({ pong: true }));

app.use("/auth", require("./routes/auth.routes"));
app.use("/matches", require("./routes/matches.routes"));

app.use((_req, res) => res.status(404).json({ message: "Not found" }));

module.exports = app;
