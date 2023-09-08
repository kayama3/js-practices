import {
  createTable,
  insertRecord,
  getAllRecords,
  dropTable,
  closeDatabase,
} from "../promise_functions.js";

createTable()
  .then(() => {
    return insertRecord("オブジェクト指向設計実践ガイド");
  })
  .then(() => {
    return insertRecord("オブジェクト指向設計実践ガイド");
  })
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    return getAllRecords("foods");
  })
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    return dropTable();
  })
  .then(() => {
    closeDatabase();
  });
