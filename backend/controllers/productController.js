const db = require("../config/db");
const protect = require("../middleware/authMiddleware");

const getProducts = (req, res) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching products"
            });
        }

        res.json(results);
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching product"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);
    });
};

const addProduct = (req, res) => {
    const { name, description, price, category, image, stock } = req.body;

    const sql = `
        INSERT INTO products
        (name, description, price, category, image, stock)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, description, price, category, image, stock],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error adding product"
                });
            }

            res.status(201).json({
                message: "Product added successfully",
                productId: result.insertId
            });
        }
    );
};


const updateProduct = (req, res) => {
    const { id } = req.params;

    const {
        name,
        description,
        price,
        category,
        image,
        stock
    } = req.body;

    const sql = `
        UPDATE products
        SET name = ?,
            description = ?,
            price = ?,
            category = ?,
            image = ?,
            stock = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, description, price, category, image, stock, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to update product"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json({
                message: "Product updated successfully"
            });
        }
    );
};

const deleteProduct = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to delete product"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    });
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};