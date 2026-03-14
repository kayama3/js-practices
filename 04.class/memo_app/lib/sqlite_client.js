import sqlite3 from "sqlite3";

export default class SqliteClient {
  #database;

  constructor(path = "./memo.db") {
    this.#database = new sqlite3.Database(path);
  }

  run(sql, ...params) {
    return this.#promisify("run", sql, ...params);
  }

  get(sql, ...params) {
    return this.#promisify("get", sql, ...params);
  }

  all(sql, ...params) {
    return this.#promisify("all", sql, ...params);
  }

  close() {
    return this.#promisify("close");
  }

  #promisify(api, ...args) {
    return new Promise((resolve, reject) =>
      this.#database[api](...args, function (error, value) {
        if (error) {
          reject(error);
        } else {
          resolve(
            api === "run"
              ? { lastID: this.lastID, changes: this.changes }
              : value
          );
        }
      })
    );
  }
}
