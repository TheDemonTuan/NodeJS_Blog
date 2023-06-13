const pool = require("../utils/db");
class Category {

  static table = "categories";

  constructor(category, type) {
    if (type == "create") {
      this.name = category.name;
      this.slug = category.slug;
      this.status = category.status ? 1 : 0;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    } else if (type == "update") {
      this.name = category.name;
      this.slug = category.slug;
      this.status = category.status ? 1 : 0;
      this.updatedAt = new Date();
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
    pool.query(`insert into ${this.table} set ?`, [new Category(data, "create")], (err, res) => {
      result(err, res);
    })
  }

  static updateById = async (id, data, result) => {
    pool.query(`update ${this.table} set ? where id = ?`, [new Category(data, "update"), id], (err, res) => {
      result(err, res);
    })
  }

  static deleteById = async (id, result) => {
    pool.execute(`delete from ${this.table} where id = ?`, [id], (err, res) => {
      result(err, res);
    })
  }
}

module.exports = Category;