import sqlite3 from "sqlite3";

export default class SqliteClient {
  #database;

  constructor(path = "./memo.db") {
    this.#database = new sqlite3.Database(path);
  }

  run(sql, param) {
    return this.#promisify("run", sql, param);
  }

  get(sql, param) {
    return this.#promisify("get", sql, param);
  }

  all(sql) {
    return this.#promisify("all", sql);
  }

  close() {
    return this.#promisify("close");
  }

  #promisify(api, ...args) {
    return new Promise((resolve, reject) =>
      this.#database[api](...args, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      })
    );
  }
}
