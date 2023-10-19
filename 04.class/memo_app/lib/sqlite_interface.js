export class sqliteInterface {
  #db;

  constructor(db) {
    this.#db = db;
  }

  createTable() {
    return this.#run('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, body TEXT NOT NULL)');
  }

  collectAll() {
    return new Promise((resolve, reject) =>
      this.#db.all('SELECT * FROM notes ORDER BY id', (error, records) => {
        if (!error) {
          resolve(records);
        } else {
          reject(error);
        }
      })
    );
  }

  deleteRecord(noteId) {
    return this.#run('DELETE FROM notes WHERE id = ?', noteId);
  }

  insertRecord(body) {
    return this.#run('INSERT INTO notes (body) VALUES (?)', body);
  }

  closeTable() {
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

  #run(sql, params) {
    return new Promise((resolve, reject) =>
      this.#db.run(sql, params, error => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      })
    );
  }
}
