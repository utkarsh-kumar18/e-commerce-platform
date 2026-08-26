const db = require("../config/db");

const createOrder = (req, res) => {
    const user_id = req.user.id;
    const { total_amount } = req.body;

    const sql = `
        INSERT INTO orders (user_id, total_amount)
        VALUES (?, ?)
    `;

    db.query(sql, [user_id, total_amount], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to create order"
            });
        }

        res.status(201).json({
            message: "Order created successfully",
            orderId: result.insertId
        });
    });
};

const getOrders = (req, res) => {
    const sql = "SELECT * FROM orders";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to get orders"
            });
        }

        res.json(results);
    });
};

const getMyOrders = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT id, user_id, total_amount, status,
               payment_status, created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Failed to get my orders:", err.message);

            return res.status(500).json({
                message: "Failed to get orders"
            });
        }

        res.json(results);
    });
};

const getOrderById = (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.id;

    const sql = `
        SELECT
            o.id AS order_id,
            o.user_id,
            o.total_amount,
            o.status,
            o.payment_status,
            o.created_at,
            p.id AS product_id,
            p.name AS product_name,
            p.image,
            oi.quantity,
            oi.price
        FROM orders o
        JOIN order_items oi
            ON o.id = oi.order_id
        JOIN products p
            ON oi.product_id = p.id
        WHERE o.id = ?
          AND o.user_id = ?
    `;

    db.query(sql, [orderId, userId], (err, results) => {
        if (err) {
            console.error("Failed to get order details:", err.message);

            return res.status(500).json({
                message: "Failed to get order details"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(results);
    });
};

module.exports = {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById
};