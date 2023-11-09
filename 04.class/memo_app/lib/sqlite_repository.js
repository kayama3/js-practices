export class SqliteRepository {
  #database;

  constructor(database) {
    this.#database = database;
  }

  createTable() {
    return this.#run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY, body TEXT NOT NULL)"
    );
  }

  closeTable() {
    return new Promise((resolve, reject) =>
      this.#database.close((error) => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      })
    );
  }

  collectAll() {
    return new Promise((resolve, reject) =>
      this.#database.all("SELECT * FROM memos ORDER BY id", (error, memos) => {
        if (!error) {
          resolve(memos);
        } else {
          reject(error);
        }
      })
    );
  }

  insertRecord(body) {
    return this.#run("INSERT INTO memos (body) VALUES (?)", body);
  }

  getMemo(memoId) {
    return new Promise((resolve, reject) =>
      this.#database.get(
        "SELECT * FROM memos WHERE id = ? ORDER BY id",
        memoId,
        (error, memo) => {
          if (!error) {
            resolve(memo);
          } else {
            reject(error);
          }
        }
      )
    );
  }

  deleteRecord(memoId) {
    return this.#run("DELETE FROM memos WHERE id = ?", memoId);
  }

  #run(sql, param) {
    return new Promise((resolve, reject) =>
      this.#database.run(sql, param, (error) => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      })
    );
  }
}
