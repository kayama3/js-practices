import { run, all, close } from "../promise_functions.js";

run("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)")
  .then(() => {
    return run(
      "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  })
  .then((id) => {
    console.log(id);
  })
  .then(() => {
    return run("INSERT INTO books (title) VALUES('Webを支える技術')");
  })
  .then((id) => {
    console.log(id);
  })
  .then(() => {
    return all("SELECT * FROM books");
  })
  .then((records) => {
    records.forEach((record) => {
      console.log(record.id, record.title);
    });
  })
  .then(() => {
    return run("DROP TABLE books");
  })
  .then(() => {
    close();
  });
