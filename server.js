const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./database.js");

app.use(cors());
app.use(express.json());

const HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

app.get("/api", (req, res) => {
  res.json({ message: "OK" });
});

app.get("/api/todos", (req, res) => {
  let sql = "SELECT * FROM todo ORDER BY completed, updated DESC";
  let params = [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get("/api/todo/:id", (req, res) => {
  let sql = "SELECT * FROM todo WHERE id = ?";
  let params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: row,
    });
  });
});

app.post("/api/todo", (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push("No name specified");
  }

  if (errors.length) {
    res.status(400).json({
      error: errors,
    });
  }

  let data = {
    name: req.body.name,
    description: req.body.description,
    created: Date.now(),
    updated: Date.now(),
  };

  let sql =
    "INSERT INTO todo (name, description, completed, created, updated) VALUES (?,?,?,?,?)";

  let params = [data.name, data.description, 0, data.created, data.updated];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

app.patch("/api/todo/:id", (req, res) => {
  let data = {
    name: req.body.name,
    description: req.body.description,
    completed: req.body.completed,
    updated: Date.now(),
  };

  let sql = `UPDATE todo SET
    name = COALESCE(?, name),
    description = COALESCE(?, description),
    completed = ?,
    updated = ?
    WHERE id = ?`;

  let params = [
    data.name,
    data.description,
    data.completed,
    data.updated,
    req.params.id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: data,
      changes: this.changes,
    });
  });
});

app.delete("/api/todo/:id", (req, res) => {
  let sql = "DELETE FROM todo WHERE id = ?";
  let params = [req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({ message: "success", changes: this.changes });
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Ohh you are lost, read the API documentation to find your way!",
  });
});
