import express from "express";
import mysql from "mysql";
import cors from "cors";
import {
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} from "./src/config.js";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

app.get("/", (req, res) => {
  res.send("Hello this is the backend");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

app.post("/books", (req, res) => {
  const q =
    "INSERT INTO books (title,author,description,price) VALUES (?,?,?,?)";

  const values = [
    req.body.title,
    req.body.author,
    req.body.description,
    req.body.price,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

//! Se le agrega :id, porque es necesario especificar cual borrar de todos
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id=?";

  db.query(q, [bookId], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Book has been deleted successfully");
    }
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;

  const values = [
    req.body.title,
    req.body.author,
    req.body.description,
    req.body.price,
  ];
  const q = `UPDATE books 
    SET 
      title = COALESCE(NULLIF(?, ''), title), 
      author = COALESCE(NULLIF(?, ''), author),
      description = COALESCE(NULLIF(?, ''), description),
      price= COALESCE(NULLIF(?, ''), price)
    WHERE id= ?`;

  db.query(q, [...values, bookId], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Book has been updated successfully");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listen in PORT: ${PORT}...`);
});
