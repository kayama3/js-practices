export class SqliteRepository {
  #database;

  constructor(database) {
    this.#database = database;
  }

  createTable() {
    return this.#run('CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY, body TEXT NOT NULL)');
  }

  collectAll() {
    return new Promise((resolve, reject) =>
      this.#database.all('SELECT * FROM memos ORDER BY id', (error, memos) => {
        if (!error) {
          resolve(memos);
        } else {
          reject(error);
        }
      })
    );
  }

  getMemo(memoId) {
    return new Promise((resolve, reject) =>
      this.#database.get('SELECT * FROM memos WHERE id = ? ORDER BY id', memoId, (error, memo) => {
        if (!error) {
          resolve(memo);
        } else {
          reject(error);
        }
      })
    );
  }

  deleteRecord(memoId) {
    return this.#run('DELETE FROM memos WHERE id = ?', memoId);
  }

  insertRecord(body) {
    return this.#run('INSERT INTO memos (body) VALUES (?)', body);
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

  #run(sql, params) {
    return new Promise((resolve, reject) =>
      this.#database.run(sql, params, error => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      })
    );
  }
}
