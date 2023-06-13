"use strict"

const express = require("express");
const path = require("path");

const app = express();

//Compression
const compression = require("compression");
app.use(compression());

// Helmet
const helmet = require("helmet");
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'", "cdnjs.cloudflare.com", "'unsafe-inline'"],
      "img-src": ["'self'", "mdbootstrap.com", "data:"],
    },
  },
}));

// ENV config
const dotenv = require("dotenv").config();
app.set("env", process.env.NODE_ENV);

// Body parser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser(process.env.COOKIE_SECRET));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Constructor for ejs template
app.use(require("./middlewares/constructor.js"));

//Redis and session
const session = require("express-session");
const redisStore = require("connect-redis").default;
global._redisClient = require("./utils/redis");

app.use(session({
  store: new redisStore({ client: _redisClient, prefix: "tdt-sess:", ttl: 300 }),
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: { httpOnly: true, secure: false, sameSite: "strict", signed: true, },
}))

// View engine setup
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"));
app.locals.pretty = true;
//const cache = require("./utils/lru")
//app.set('view cache', true);
//app.set('cache', cache);

// Routes init
const routes = require("./routes");
routes(app);

app.listen(process.env.NODE_ENV == "production" ? null : process.env.NODE_PORT);
