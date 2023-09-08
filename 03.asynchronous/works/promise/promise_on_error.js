import { run, all, close } from "../promise_functions.js";

run("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)")
  .then(() => {
    return run(
      "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  })
  .then(() => {
    return run(
      "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  })
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    return all("SELECT * FROM foods");
  })
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    return run("DROP TABLE books");
  })
  .then(() => {
    close();
  });
