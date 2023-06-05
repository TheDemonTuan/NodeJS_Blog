const db = require("../utils/db");

class Users {
  constructor(user) {
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
  }
  static findAll(result) {
    db.query("select * from users", (err, res) => {
      if (err) result(err, res);
      else result(err, res);
    });
  }
  static findByUsername(username, result) {
    db.query("select * from users where username = ?", username, (err, res) => {
      if (err) result(err, res);
      else result(err, res);
    });
  }
  static findByEmail(email, result) {
    db.query(`select * from users where email = '${email}'`, (err, res) => {
      if (err) result(err, res);
      else result(err, res);
    });
  }

  static findByEmailOrUsername(email, username, result) {
    db.query(
      `select id from users where email = '${email}' or username = '${username}'`,
      (err, res) => {
        if (err) result(err, res);
        else result(err, res);
      }
    );
  }
  static findById(id, result) {
    db.query("'select * from users where id = ?", id, (err, res) => {
      if (err) result(err, res);
      else result(err, res);
    });
  }
  static create(newUser, result) {
    db.query("insert into users set ?", newUser, (err, res) => {
      if (err) result(err, res);
      else result(err, res);
    });
  }
}

module.exports = Users;
