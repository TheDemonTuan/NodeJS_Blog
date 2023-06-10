const pool = require("../utils/db");

class Users {
  constructor(user) {
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
  }
  static findAll(result) {
    pool.execute("select * from users", (err, res) => {
      result(err, res);
    });
  }
  static async findByUsername(username, result) {
    // Do something with the connection
    pool.execute("select * from users where username = ?", [username], (err, res) => {
      result(err, res);
    }
    );
  }
  static findByEmail(email, result) {
    pool.execute("select * from users where email = ?", [email], (err, res) => {
      result(err, res);
    });
  }

  static async findByEmailOrUsername(email, username, result) {
    pool.execute("select id from users where email = ? or username = ?", [email, username], (err, res) => {
      result(err, res);
    }
    );
  }
  static async findById(id, result) {
    pool.execute("select * from users where id = ?", [id], (err, res) => {
      result(err, res);
    });
  }
  static async create(newUser, result) {
    pool.query("insert into users set ?", [newUser], (err, res) => {
      result(err, res);
    });
  }

}

module.exports = Users;
