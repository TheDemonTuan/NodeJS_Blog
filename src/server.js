"use strict"

const express = require("express");
const path = require("path");

const app = express();

//Compression
const compression = require("compression");
app.use(compression());

// Helmet
// const helmet = require("helmet");
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       "img-src": ["'self'", "mdbootstrap.com", "sp.tinymce.com" ,"data:"],
//       "script-src-elem": ["'self'", "www.google.com", "cdnjs.cloudflare.com","www.gstatic.com","cdn.tiny.cloud" ,"'unsafe-inline'"],
//       "frame-src": ["'self'", "www.google.com"],
//       "connect-src": ["'self'", "spelling.tiny.cloud"],
//     },
//   },
// }));

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
global.staticPath = path.join(__dirname, "public")
app.use(express.static(global.staticPath));

// Constructor for ejs template
app.use(require("./middlewares/constructor.js"));

//Redis and session
const session = require("express-session");
const redisStore = require("connect-redis").default;
global.redisClient = require("./utils/redis");

app.use(session({
  store: new redisStore({ client: redisClient.connect, prefix: "tdt_sess:", ttl: 300 }),
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

// Routes init
const routes = require("./routes");
routes(app);

// socket.io
const http = require("http").createServer(app);
global.io = require("socket.io")(http);
const SocketServices = require("./services/socket.js");
io.on('connection',SocketServices.connection);

http.listen(process.env.NODE_ENV == "production" ? null : process.env.NODE_PORT);
