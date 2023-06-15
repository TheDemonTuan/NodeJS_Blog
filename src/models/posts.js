const pool = require("../utils/db");

class Posts {

  static table = "posts";

  constructor(post, type) {
    if (type == "create") {
      this.category_id = post.category_id;
      this.thumbnail = post.thumbnail;
      this.title = post.title;
      this.slug = post.slug;
      this.description = post.description;
      this.content = post.content;
      this.status = post.status ? 1 : 0;
    }
    if (type == "update") {
      this.category_id = post.category_id;
      this.thumbnail = post.thumbnail;
      this.title = post.title;
      this.slug = post.slug;
      this.description = post.description;
      this.content = post.content;
      this.status = post.status ? 1 : 0;
      this.updatedAt = new Date();
    }
  }

  static getAll(result) {
    pool.execute(`select * from ${this.table}`, (err, res) => {
      result(err, res);
    });
  }

  static findById(id, result) {
    pool.execute(`select * from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res[0]);
    });
  }

  static deleteById(id, result) {
    pool.execute(`delete from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res);
    });
  }

  static create(post, result) {
    pool.query(`insert into ${this.table} set ?`, [new Posts(post, 'create')], (err, res) => {
      result(err, res);
    });
  }

  static updateById(id, post, result) {
    pool.query(`update ${this.table} set ? where id = ?`, [new Posts(post, 'update'), id], (err, res) => {
      result(err, res);
    });
  }

}

module.exports = Posts;