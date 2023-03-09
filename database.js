const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("todo.db", (err) => {
  if (err) {
    throw err;
  }

  console.log("Connected to the SQLite database.");

  db.run(
    `CREATE TABLE todo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      completed INTEGER,
      created INTEGER,
      updated INTEGER
    )`,
    (err) => {
      if (err) {
        return;
      }

      var insert =
        "INSERT INTO todo (name, description, completed, created, updated) VALUES (?,?,?,?,?)";

      db.run(insert, [
        "Einkaufen gehen",
        "Wir brauchen unbedingt Gurke",
        0,
        Date.now(),
        Date.now(),
      ]);
      db.run(insert, [
        "Wohnung putzen",
        "Das Klo ist zuge*****, dringender Handlungsbedarf!!!",
        0,
        Date.now(),
        Date.now(),
      ]);
    }
  );
});

module.exports = db;
