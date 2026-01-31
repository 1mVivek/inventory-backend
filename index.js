const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Inventory backend running");
});

/* ===============================
   PRODUCTS
================================ */

// ADD PRODUCT
app.post("/products", (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || price == null || quantity == null) {
    return res.status(400).json({ error: "All fields required" });
  }

  const query = `
    INSERT INTO products (name, price, quantity)
    VALUES (?, ?, ?)
  `;

  db.run(query, [name, price, quantity], function (err) {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "Product added successfully",
      product_id: this.lastID
    });
  });
});

// GET PRODUCTS
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

/* ===============================
   SERVER (RENDER SAFE)
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
