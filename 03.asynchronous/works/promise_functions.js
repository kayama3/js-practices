export function run(database, sql) {
  return new Promise((resolve, reject) => 
    database.run(sql, function(error) {
      if (!error) {
        resolve(this.lastID);
      } else {
        reject(error);
      }
    })
  );
}

export function all(database, sql) {
  return new Promise((resolve, reject) => 
    database.all(sql, (error, records) => {
      if (!error) {
        resolve(records);
      } else {
        reject(error);
      }
    })
  )
}

export function close(database) {
  return new Promise((resolve, reject) => 
    database.close((error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    })
  );
}
