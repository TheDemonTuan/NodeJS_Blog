'use strict'

const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Helmet
const helmet = require("helmet");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "cdnjs.cloudflare.com", "'unsafe-inline'"],
        "img-src": ["'self'", "mdbootstrap.com"],
      },
    },
  })
);

// ENV config
const dotenv = require("dotenv").config();
app.set("env", process.env.NODE_ENV ?? "production");

// Body parser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser(process.env.COOKIE_SECRET));

//Redis and session
const session = require("express-session");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default

try {
  let redisStore = new RedisStore({ client: new Redis(), prefix: "tdt-sess:", ttl: 3600 })

  app.use(
    session({
      store: redisStore,
      name: process.env.SESSION_NAME,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: process.env.SESSION_SECRET,
      cookie: {
        httpOnly: true,
        secure: false, // required: only set cookies over https
        sameSite: "strict", // recommended: csrf
      },
    })
  )
} catch (err) {
  console.log(err)
}

// Message middleware
const message = require("./middlewares/message.js");
app.use(message.check)

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//app.set("view cache", false);
//app.locals.pretty = true;

// Routes init
const routes = require("./routes");
routes(app);

app.listen(port);
