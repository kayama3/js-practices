import { run, all, close } from "../promise_functions.js";
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

run(db, "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)")
  .then(() => {
    return run(
      db, "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  })
  .then(() => {
    return run(
      db, "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  })
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    return all(db, "SELECT * FROM foods");
  })
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    return run(db, "DROP TABLE books");
  })
  .then(() => {
    close(db);
  });
