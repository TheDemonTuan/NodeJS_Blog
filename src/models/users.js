const pool = require("../utils/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class Users {

  static table = "users";

  constructor(user, type) {
    if (type == "create") {
      const duplicateID = false
      do {
        this.id = crypto.randomBytes(64).toString("hex");
        Users.findById(this.id, (err, result) => {
          if (result) duplicateID = true;
        });
      } while (duplicateID);
      this.email = user.email;
      this.username = user.username;
      this.password = bcrypt.hashSync(user.password, 11);
    }
    if (type == "update") {
      this.email = user.email;
      this.username = user.username;
      if (user.password)
        this.password = bcrypt.hashSync(user.password, 11);
      this.role = user.role;
      this.status = user.status ? 1 : 0;
    }
  }

  static getAll(result) {
    pool.execute(`select * from ${this.table}`, (err, res) => {
      result(err, res);
    });
  }

  static async findByUsername(username, result) {
    // Do something with the connection
    pool.execute(`select * from ${this.table} where username = ?`, [username], (err, res) => {
      result(err, res);
    }
    );
  }
  static findByEmail(email, result) {
    pool.execute(`select * from ${this.table} where email = ?`, [email], (err, res) => {
      result(err, res);
    });
  }

  static async findByEmailOrUsername(email, username, result) {
    pool.execute(`select id from ${this.table} where email = ? or username = ?`, [email, username], (err, res) => {
      result(err, res);
    }
    );
  }
  static async findById(id, result) {
    pool.execute(`select * from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res[0]);
    });
  }
  static async create(user, result) {
    pool.query(`insert into ${this.table} set ?`, [new Users(user, 'create')], (err, res) => {
      result(err, res);
    });
  }

  static async updateById(id, user, result) {
    pool.query(`update ${this.table} set ? where id = ?`, [new Users(user, 'update'), id], (err, res) => {
      result(err, res);
    });
  }

  static async deleteById(id, result) {
    pool.execute(`delete from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res);
    });
  }

}

module.exports = Users;
