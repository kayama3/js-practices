import { run, all, close } from "../promise_functions.js";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)"
)
  .then(() => {
    return run(
      db,
      "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  })
  .then((id) => {
    console.log(id);
    return run(db, "INSERT INTO books (title) VALUES('Webを支える技術')");
  })
  .then((id) => {
    console.log(id);
    return all(db, "SELECT * FROM books");
  })
  .then((records) => {
    records.forEach((record) => {
      console.log(record.id, record.title);
    });
  })
  .then(() => {
    return run(db, "DROP TABLE books");
  })
  .then(() => {
    close(db);
  });
