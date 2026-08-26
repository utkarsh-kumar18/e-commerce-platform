const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require("./routes/orderItemRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const {
    handleStripeWebhook
} = require("./controllers/paymentWebhookController");

const db = require("./config/db");

const app = express();

app.use(cors());

app.post(
    "/api/payment/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "E-Commerce API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});