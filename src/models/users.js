const pool = require("../utils/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class User {

  static table = "users";

  constructor(user, type) {
    if (type === 'signUp') {
      this.id = `${crypto.randomUUID()}-${Date.now()}`;
      this.displayName = user.displayName;
      this.email = user.email;
      this.username = user.username;
      this.password = bcrypt.hashSync(user.password, 11);
    }

    if (type === 'updateInfo') {
      this.avatar = user.avatar;
      this.displayName = user.displayName;
      this.description = user.description;
    }

    if (type === 'updateAccount') {
      this.username = user.username;
      this.email = user.email;
    }

    if (type === 'updatePassword') {
      this.password = bcrypt.hashSync(user.password, 11);
    }
  };

  static getAll(result) {
    pool.execute(`select * from ${this.table}`, (err, res) => {
      result(err, res);
    });
  };

  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      pool.execute(`select * from ${this.table} where username = ?`, [username], (err, res) => {
        if (err) reject(err);
        else resolve(res[0]);
      }
      );
    });
  };

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      pool.execute(`select * from ${this.table} where email = ?`, [email], (err, res) => {
        if (err) reject(err);
        else resolve(res[0]);
      });
    });
  };

  static async findByDisplayName(displayName) {
    return new Promise((resolve, reject) => {
      pool.query(`select * from ${this.table} where displayName = ?`, [displayName], (err, res) => {
        if (err) reject(err);
        else resolve(res[0]);
      });
    });
  };

  static async findByEmailOrUsernameOrDisplayName(email, username, displayName) {
    return new Promise((resolve, reject) => {
      pool.execute(`select id from ${this.table} where email = ? or username = ? or displayName = ?`, [email, username, displayName], (err, res) => {
        if (err) reject(err);
        else resolve(res[0]);
      }
      );
    });
  };

  static async findByEmailOrUsername(email, username) {
    return new Promise((resolve, reject) => {
      pool.execute(`select id from ${this.table} where email = ? or username = ?`, [email, username], (err, res) => {
        if (err) reject(err);
        else resolve(res[0]);
      }
      );
    });
  };

  static async findById(id) {
    return new Promise((resolve, reject) => {
      pool.execute(`select * from ${this.table} where id = ?`, [id], (err, res) => {
        if (err) reject(err);
        else resolve(res[0]);
      });
    });
  }
  static async create(user) {
    return new Promise((resolve, reject) => {
      pool.query(`insert into ${this.table} set ?`, [user], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  static async updateById(id, user) {
    return new Promise((resolve, reject) => {
      pool.query(`update ${this.table} set ? where id = ?`, [user, id], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  static async deleteById(id, result) {
    pool.execute(`delete from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res);
    });
  }

}

module.exports = User;
