// routes/payment.js

const express = require("express");

require("dotenv").config();

const Razorpay = require("razorpay");

const crypto = require("crypto");

const router = express.Router();



// ======================
// RAZORPAY INSTANCE
// ======================

const razorpay = new Razorpay({

    key_id:
    process.env.RAZORPAY_KEY_ID,

    key_secret:
    process.env.RAZORPAY_KEY_SECRET,

});



console.log(
    "RAZORPAY KEY:",
    process.env.RAZORPAY_KEY_ID
);



// ======================
// CREATE ORDER
// ======================

router.post(

    "/api/create-order",

    async (req, res) => {

        try {

            // GET PRICE FROM FRONTEND
            const amount =
                Number(req.body.amount);



            console.log(
                "PRODUCT PRICE:",
                amount
            );



            // VALIDATION
            if (!amount || amount <= 0) {

                return res.status(400).json({

                    success: false,

                    message:
                    "Invalid product price"

                });

            }



            // CREATE ORDER OPTIONS
            const options = {

                // RAZORPAY ACCEPTS PAISE
                amount:
                amount * 100,

                currency:
                "INR",

                receipt:
                `receipt_${Date.now()}`,

            };



            console.log(
                "RAZORPAY AMOUNT:",
                options.amount
            );



            // CREATE ORDER
            const order =
                await razorpay.orders.create(
                    options
                );



            console.log(
                "ORDER CREATED:",
                order.id
            );



            // SEND ORDER DETAILS
            res.status(200).json({

                success: true,

                order_id:
                order.id,

                amount:
                order.amount,

                currency:
                order.currency,

            });

        } catch (error) {

            console.log(
                "CREATE ORDER ERROR:",
                error
            );



            res.status(500).json({

                success: false,

                message:
                "Order creation failed",

            });

        }

    }

);



// ======================
// VERIFY PAYMENT
// ======================

router.post(

    "/api/verify-payment",

    async (req, res) => {

        try {

            const {

                razorpay_order_id,

                razorpay_payment_id,

                razorpay_signature

            } = req.body;



            console.log(req.body);



            // GENERATE SIGNATURE
            const generated_signature =
                crypto

                .createHmac(

                    "sha256",

                    process.env
                    .RAZORPAY_KEY_SECRET

                )

                .update(

                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id

                )

                .digest("hex");



            // VERIFY SIGNATURE
            if (

                generated_signature ===
                razorpay_signature

            ) {

                console.log(
                    "PAYMENT VERIFIED"
                );



                res.status(200).json({

                    success: true,

                    message:
                    "Payment Successful"

                });

            } else {

                console.log(
                    "INVALID SIGNATURE"
                );



                res.status(400).json({

                    success: false,

                    message:
                    "Payment Verification Failed"

                });

            }

        } catch (error) {

            console.log(
                "VERIFY ERROR:",
                error
            );



            res.status(500).json({

                success: false,

                message:
                "Internal Server Error"

            });

        }

    }

);



// ======================
// EXPORT ROUTER
// ======================

module.exports = router;