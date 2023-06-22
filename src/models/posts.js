'use strict'

const pool = require("../utils/db");
const readingTime = require("reading-time");

class Posts {

  static table = "posts";

  constructor(post, type) {
    post.read_time = readingTime(post.content).minutes < 1 ? 1 : readingTime(post.content).minutes;
    post.status = post.status ? 1 : 0;
    if (type == "create") {
      this.tag_list = post.tag_list;
      this.category_slug = post.category_slug;
      this.link = post.link;
      this.thumbnail = post.thumbnail;
      this.title = post.title;
      this.slug = post.slug;
      this.description = post.description;
      this.content = post.content;
      this.read_time = post.read_time;
      this.status = post.status;
    };
    if (type == "update") {
      this.tag_list = post.tag_list;
      this.category_slug = post.category_slug;
      this.link = post.link;
      this.thumbnail = post.thumbnail;
      this.title = post.title;
      this.slug = post.slug;
      this.description = post.description;
      this.content = post.content;
      this.read_time = post.read_time;
      this.status = post.status;
      this.updatedAt = new Date();
    };
  };

  static getAll(result) {
    pool.execute(`select * from ${this.table} order by id desc`, (err, res) => {
      result(err, res);
    });
  };

  static getWithLimitNotSameId(id, limit, result) {
    pool.query(`select * from ${this.table} where id <> ? order by id desc limit ?`, [id, limit], (err, res) => {
      result(err, res);
    });
  };

  static getWithLimit(limit, result) {
    pool.query(`select * from ${this.table} order by id desc limit ?`, [limit], (err, res) => {
      result(err, res);
    });
  };

  static paginate(lastid, limit, result) {
    pool.query(`select * from ${this.table} where id < ? order by id desc limit ?`, [lastid, limit], (err, res) => {
      result(err, res);
    });
  };

  static findById(id, result) {
    pool.execute(`select * from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res[0]);
    });
  };

  static findBySlug(slug, result) {
    pool.execute(`select * from ${this.table} where slug = ?`, [slug], (err, res) => {
      result(err, res[0]);
    });
  };

  static deleteById(id, result) {
    pool.execute(`delete from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res);
    });
  };

  static create(post, result) {
    pool.query(`insert into ${this.table} set ?`, [new Posts(post, 'create')], (err, res) => {
      result(err, res);
    });
  }

  static updateById(id, post, result) {
    pool.query(`update ${this.table} set ? where id = ?`, [new Posts(post, 'update'), id], (err, res) => {
      result(err, res);
    });
  };

}

module.exports = Posts;