const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try {
        const { order_id, amount } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: "aud",
                        product_data: {
                            name: `E-Commerce Order #${order_id}`
                        },
                        unit_amount: Math.round(amount * 100)
                    },
                    quantity: 1
                }
            ],

            mode: "payment",

            metadata: {
                order_id: order_id
            },

            success_url: "http://localhost:5173/payment-success",
            cancel_url: "http://localhost:5173/payment-cancel"
        });

        res.status(200).json({
            message: "Checkout session created",
            url: session.url
        });

    } catch (error) {
        console.error("Stripe error:", error.message);

        res.status(500).json({
            message: "Payment session failed",
            error: error.message
        });
    }
};

module.exports = {
    createCheckoutSession
};