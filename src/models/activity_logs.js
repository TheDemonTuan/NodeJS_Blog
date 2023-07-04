const pool = require("../utils/db");
var parser = require('ua-parser-js');

class ActivityLog {

  static table = "activity_logs";

  constructor(user_id, action, req) {
    const ua = parser(req.headers['user-agent']);
    this.user_id = user_id;
    this.action = action;
    this.browser = `${ua.browser.name} ${ua.browser.version}`;
    this.engine = `${ua.engine.name} ${ua.engine.version}`;
    this.os = `${ua.os.name} ${ua.os.version}`;
    this.cpu = ua.cpu.architecture;
    this.ip = req.ip;
    this.time = new Date();
  }

  static async getAllFromUserId(id) {
    return new Promise((resolve, reject) => {
      pool.execute(`select * from ${this.table} where user_id = ?`, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async create(user, action, req) {
    return new Promise((resolve, reject) => {
      if (user.activity_mode) {
        pool.query(`insert into ${this.table} set ?`, [new ActivityLog(user.id, action, req)], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      }
      else resolve(true);
    });
  }

}

module.exports = ActivityLog;