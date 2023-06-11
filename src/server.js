"use strict"

const { error } = require("console");

const server = async () => {
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
        "img-src": ["'self'", "mdbootstrap.com"],
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
  const Redis = require("ioredis");
  const RedisStore = require("connect-redis").default;
  const redisClient = new Redis();

  // Sử dụng hàm để đợi Redis kết nối
  try {
    const isRedisConnect = await new Promise((resolve, reject) => {
      if (redisClient.status === 'connect') {
        resolve(true);
      } else {
        redisClient.on('connect', () => {
          resolve(true);
        });
        redisClient.on('error', (error) => {
          reject(error);
        });
      }
    });

    // Nếu kết nối thành công thì sử dụng RedisStore
    if (isRedisConnect) {
      let redisStore = new RedisStore({ client: redisClient, prefix: "tdt-sess:", ttl: 300 })
      app.use(session({
        store: redisStore,
        name: process.env.SESSION_NAME,
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: { httpOnly: true, secure: false, sameSite: "strict", signed: true, },
      }));
    }
  } catch (err) {
    redisClient.disconnect();
    app.use((req, res, next) => {
      return next(err);
    });
  }

  // View engine setup
  app.set("view engine", "ejs");
  const { LRUCache } = require('lru-cache')
  const options = {
    max: 500,

    // for use with tracking overall storage size
    maxSize: 5000,
    sizeCalculation: (value, key) => {
      return 1
    },

    // how long to live in ms
    ttl: 1000 * 60 * 5,

    // return stale items before removing from cache?
    allowStale: false,

    updateAgeOnGet: false,
    updateAgeOnHas: false,
  }
  //const cache = new LRUCache(options)
  //app.set('view cache', true);
  app.set("views", path.join(__dirname, "views"));
  //app.set('cache', cache);

  // Routes init
  const routes = require("./routes");
  routes(app);

  app.listen(process.env.NODE_ENV == "production" ? 3000 : process.env.NODE_PORT);
}
server();