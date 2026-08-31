const express = require("express");

const {
    protect,
    admin
} = require("../middleware/authMiddleware");

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, admin, addProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;