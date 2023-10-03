export class sqliteInterface {
  #db;

  constructor(db) {
    this.#db = db;
  }

  run(sql) {
    return new Promise((resolve, reject) =>
      this.#db.run(sql, function (error) {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      })
    );
  }

  all(sql) {
    return new Promise((resolve, reject) =>
      this.#db.all(sql, (error, records) => {
        if (!error) {
          resolve(records);
        } else {
          reject(error);
        }
      })
    );
  }

  close() {
    return new Promise((resolve, reject) =>
      this.#db.close((error) => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      })
    );
  }
}
