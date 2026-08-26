const express = require("express");

const {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", getOrders);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;