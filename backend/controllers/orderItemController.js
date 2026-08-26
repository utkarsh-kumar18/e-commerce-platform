const db = require("../config/db");

const addOrderItem = (req, res) => {
    const { order_id, product_id, quantity, price } = req.body;

    const sql = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [order_id, product_id, quantity, price],
        (err, result) => {
            if (err) {
                console.error("Order item error:", err);

                return res.status(500).json({
                    message: "Failed to add order item",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Order item added successfully",
                itemId: result.insertId
            });
        }
    );
};

const getOrderItems = (req, res) => {
    const { order_id } = req.params;

    const sql = `
        SELECT *
        FROM order_items
        WHERE order_id = ?
    `;

    db.query(sql, [order_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to get order items"
            });
        }

        res.json(results);
    });
};

module.exports = {
    addOrderItem,
    getOrderItems
};