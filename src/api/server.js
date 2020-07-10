const express = require("express");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
const { json } = require("express");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
require("dotenv").config();

const server = express();

const animalRoutes = require("./routes/animalsRoute");
const authRoutes = require("./routes/authRoute");

// Passport config
require("./auth/passport")(passport);

// Middleware
server.use(helmet());
server.use(json());

const corsConfig = {
  origin: true,
  credentials: true,
};
server.use(cors(corsConfig));
server.options("*", cors(corsConfig));

// Express Session
server.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false, // only resave session when a change is made
    saveUninitialized: true, // only save cookie/sessions if logged in
    store: new knexSessionStore({
      knex: require("../database/dbConfig"),
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 1000 * 60 * 60,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport middleware
server.use(passport.initialize());
server.use(passport.session());

server.use((req, res, next) => {
  console.log("req.session", req.session, "sid", req.sessionID);
  return next();
});

// Routes
server.use("/", authRoutes);
server.use("/animals", animalRoutes);

server.get("/", (req, res) => {
  res.send("Pawtners server is running");
});

module.exports = server;
