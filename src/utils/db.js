const mysql = require("mysql");

// Database config
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
});

con.connect(function (err) {
  if (err) console.error("cant connect to database");
});

module.exports = con;