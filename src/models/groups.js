const Promise = require("bluebird");
const pool = Promise.promisifyAll(require("../utils/db"));
const User = require('../models/users');
class Group {

  static async home() {
    let connection;
    try {
      connection = await pool.getConnectionAsync();
      Promise.promisifyAll(connection); // Promisify connection

      const lastest_datapack = connection.queryAsync('SELECT * FROM posts order by id desc limit 1');
      const lastest_updated_datapacks = connection.queryAsync('SELECT * FROM posts order by updatedAt limit 4');
      const recent_datapacks = connection.queryAsync('SELECT * FROM posts order by id desc limit 1,5');
      const categories = connection.queryAsync('SELECT * FROM categories');
      const tags = connection.queryAsync('SELECT * FROM tags');

      const result = await Promise.all([lastest_datapack, lastest_updated_datapacks, recent_datapacks, categories, tags]);

      return result;

    } catch (error) {
      return false;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  };

  static async signUp(data) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await pool.getConnectionAsync();
        Promise.promisifyAll(connection);

        let userData = new User(data, 'signUp');
        let addUserInfo = await connection.queryAsync(`insert into ${User.table} set ?`, [userData]);

        resolve(addUserInfo);
      } catch (error) {
        reject(error);
      } finally {
        if (connection) {
          connection.release();
        }
      }
    });
  }
}

module.exports = Group;