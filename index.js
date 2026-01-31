const express = require("express");
const db = require("./db");
const app = express();
app.use(express.json());
// Test route
app.get("/", (req, res) => {
res.send("Inventory backend running");
});
// CREATE PRODUCTS TABLE (if not exists)
db.run(`
CREATE TABLE IF NOT EXISTS products (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
price INTEGER NOT NULL,
quantity INTEGER NOT NULL
)
`);
// 👉 ADD PRODUCT (THIS WAS MISSING / BROKEN)
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
console.error(err);
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
db.all("SELECT * FROM products", [], (err, rows) => {
if (err) {
return res.status(500).json({ error: "Database error" });
}
res.json(rows);
});
});
const PORT = 5000;
app.listen(PORT, () => {
console.log("Server running on PORT", PORT);
});