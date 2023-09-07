import {
  createTable,
  insertRecord,
  getRecord,
  getAllRecords,
  dropTable,
  closeDatabase,
} from "../promise_functions.mjs";

createTable()
  .then(() => {
    return insertRecord("オブジェクト指向設計実践ガイド");
  })
  .then(() => {
    return getRecord("オブジェクト指向設計実践ガイド");
  })
  .then((record) => {
    console.log(record.id);
  })
  .then(() => {
    return insertRecord("Webを支える技術");
  })
  .then(() => {
    return getRecord("Webを支える技術");
  })
  .then((record) => {
    console.log(record.id);
  })
  .then(() => {
    return getAllRecords("books");
  })
  .then((records) => {
    records.forEach((record) => {
      console.log(record.id, record.title);
    });
  })
  .then(() => {
    return dropTable();
  })
  .then(() => {
    closeDatabase();
  });
