const Stripe = require("stripe");
const db = require("../config/db");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const handleStripeWebhook = (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error(
            "Webhook signature verification failed:",
            error.message
        );

        return res.status(400).send(
            `Webhook Error: ${error.message}`
        );
    }

    if (event.type !== "checkout.session.completed") {
        return res.json({
            received: true
        });
    }

    const session = event.data.object;

    const orderId = session.metadata.order_id;

    console.log(
        "Stripe payment completed for order:",
        orderId
    );

    // Update order payment status
    const updateOrderSql = `
        UPDATE orders
        SET payment_status = 'Paid',
            status = 'Processing'
        WHERE id = ?
    `;

    db.query(
        updateOrderSql,
        [orderId],
        (err, result) => {
            if (err) {
                console.error(
                    "Failed to update payment status:",
                    err.message
                );

                return res.status(500).json({
                    message:
                        "Failed to update payment status"
                });
            }

            // Prevent duplicate webhook from decreasing stock again
            if (result.affectedRows === 0) {
                console.log(
                    "Payment already processed for order:",
                    orderId
                );

                return res.json({
                    received: true
                });
            }

            console.log(
                "Order payment status updated to Paid"
            );

            // Get products from this order
            const orderItemsSql = `
                SELECT product_id, quantity
                FROM order_items
                WHERE order_id = ?
            `;

            db.query(
                orderItemsSql,
                [orderId],
                (err, items) => {
                    if (err) {
                        console.error(
                            "Failed to get order items:",
                            err.message
                        );

                        return res.status(500).json({
                            message:
                                "Failed to get order items"
                        });
                    }

                    if (items.length === 0) {
                        console.log(
                            "No order items found for order:",
                            orderId
                        );

                        return res.json({
                            received: true
                        });
                    }

                    let completed = 0;

                    items.forEach((item) => {
                        const updateStockSql = `
                            UPDATE products
                            SET stock = stock - ?
                            WHERE id = ?
                            AND stock >= ?
                        `;

                        db.query(
                            updateStockSql,
                            [
                                item.quantity,
                                item.product_id,
                                item.quantity
                            ],
                            (err, stockResult) => {
                                if (err) {
                                    console.error(
                                        "Failed to update stock:",
                                        err.message
                                    );
                                } else if (
                                    stockResult.affectedRows === 0
                                ) {
                                    console.error(
                                        "Not enough stock for product:",
                                        item.product_id
                                    );
                                } else {
                                    console.log(
                                        "Stock updated for product:",
                                        item.product_id
                                    );
                                }

                                completed++;

                                if (
                                    completed ===
                                    items.length
                                ) {
                                    console.log(
                                        "Inventory update completed for order:",
                                        orderId
                                    );

                                    return res.json({
                                        received: true
                                    });
                                }
                            }
                        );
                    });
                }
            );
        }
    );
};

module.exports = {
    handleStripeWebhook
};