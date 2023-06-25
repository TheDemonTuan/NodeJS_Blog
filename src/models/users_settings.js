const pool = require("../utils/db");

class UserSetting {

  static table = "users_settings";

  constructor(user, type) {
    if (type === 'updateSecurity') {
      this.activity_mode = user.activity_mode;
    }
  };

  static getAll(result) {
    pool.execute(`select * from ${this.table}`, (err, res) => {
      result(err, res);
    });
  };

  static create(user) {
    return new Promise((resolve, reject) => {
      pool.query(`insert into ${this.table} set ?`, [user], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  static findByUserId(id) {
    return new Promise((resolve, reject) => {
      pool.execute(`select * from ${this.table} where user_id = ?`, [id], (err, res) => {
        if (err) reject(err);
        else resolve(res[0]);
      });
    });
  }

  static updateByUserId(id, user) {
    return new Promise((resolve, reject) => {
      pool.query(`update ${this.table} set ? where user_id = ?`, [user, id], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
}

module.exports = UserSetting;