import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

export function run(sql) {
  return new Promise((resolve, reject) => 
    db.run(sql, function(error) {
      if (!error) {
        resolve(this.lastID);
      } else {
        reject(error);
      }
    })
  );
}

export function all(sql) {
  return new Promise((resolve, reject) => 
    db.all(sql, (error, records) => {
      if (!error) {
        resolve(records);
      } else {
        reject(error);
      }
    })
  )
}

export function close() {
  return new Promise((resolve, reject) => 
    db.close((error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    })
  );
}
