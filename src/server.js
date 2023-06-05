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
        "script-src": ["'self'", "cdnjs.cloudflare.com"],
      },
    },
  })
);

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

// View engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Routes init
const routes = require("./routes");
routes(app);

app.listen(port);
