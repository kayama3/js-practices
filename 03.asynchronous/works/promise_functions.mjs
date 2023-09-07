import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

export function createTable() {
  return new Promise((resolve) => {
    db.run("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)", () => {
      resolve();
    });
  });
};

export function insertRecord(title) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO books (title) VALUES (?)", title, () => {
      stmt.run((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        };
      });
    });
  });
};

export function getRecord(title) {
  return new Promise((resolve) => {
    db.get("SELECT * FROM books WHERE title = ?", title, (err, row) => {
      resolve(row);
    });
  });
}

export function getAllRecords(table) { 
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM " + table, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      };
    });
  });
};

export function dropTable() {
  return new Promise((resolve) => {
    db.run("DROP TABLE books", () => {
      resolve();
    });
  });
};

export function closeDatabase() {
  return new Promise((resolve) => {
    db.close(() => {
      resolve();
    });
  });
};
