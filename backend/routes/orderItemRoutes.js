const express = require("express");

const {
    addOrderItem,
    getOrderItems
} = require("../controllers/orderItemController");

const router = express.Router();

router.post("/", addOrderItem);
router.get("/:order_id", getOrderItems);

module.exports = router;