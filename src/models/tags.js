const pool = require("../utils/db");

class Tag {

  static table = "tags";

  constructor(tag, type) {
    if (type == "create") {
      this.name = tag.name;
      this.slug = tag.slug;
    }
    if (type == "update") {
      this.name = tag.name;
      this.slug = tag.slug;
    }
  }

  static getAll = async (result) => {
    pool.execute(`select * from ${this.table}`, (err, res) => {
      result(err, res);
    })
  }

  static findById = async (id, result) => {
    pool.execute(`select * from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res[0]);
    })
  }

  static create = async (data, result) => {
    pool.query(`insert into ${this.table} set ?`, [new Tag(data, "create")], (err, res) => {
      result(err, res);
    })
  }

  static updateById = async (id, data, result) => {
    pool.query(`update ${this.table} set ? where id = ?`, [new Tag(data, "update"), id], (err, res) => {
      result(err, res);
    })
  }

  static deleteById = async (id, result) => {
    pool.execute(`delete from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res);
    })
  }
}

module.exports = Tag;