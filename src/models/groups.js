const Promise = require("bluebird");
const pool = Promise.promisifyAll(require("../utils/db"));

class Groups {
  static async home() {
    let connection;
    try {
      connection = await pool.getConnectionAsync();
      Promise.promisifyAll(connection); // Promisify connection

      const lastest_datapack = connection.queryAsync('SELECT * FROM posts order by id desc limit 1');
      const lastest_updated_datapacks = connection.queryAsync('SELECT * FROM posts order by updatedAt limit 4');
      const recent_datapacks = connection.queryAsync('SELECT * FROM posts order by id desc limit 1,5');
      const tags = connection.queryAsync('SELECT * FROM tags');

      const result = await Promise.all([lastest_datapack, lastest_updated_datapacks, recent_datapacks, tags]);

      return result;

    } catch (error) {
      //console.error('Lỗi:', error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = Groups;