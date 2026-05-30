const express = require("express");
const app = express();

const path = require("path");

require("dotenv").config();

const paymentRoutes = require("./routes/payment");

const port = process.env.PORT || 8080;


// ======================
// MIDDLEWARE
// ======================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));



// STATIC FILES
app.use(express.static(
    path.join(__dirname, "public")
));



// VIEW ENGINE
app.set("view engine", "ejs");

app.set("views",
    path.join(__dirname, "views")
);



// ======================
// PAYMENT ROUTES
// ======================

app.use("/", paymentRoutes);



// ======================
// HOME PAGE
// ======================

app.get("/", (req, res) => {

    const pCategory =
        require("./itemData/item.json");

    res.render("home.ejs", {
        data: pCategory
    });

});



// ======================
// PRODUCT DETAILS
// ======================

app.get("/product/:id", (req, res) => {

    const pdetails =
        require("./itemData/p_details.json");

    const id =
        parseInt(req.params.id);



    const product =
        pdetails.AllDeta.find(
            item => item.id === id
        );



    if (!product) {

        return res.send(
            "Product not found"
        );

    }



    res.render("p_details", {
        product
    });

});



// ======================
// ADDRESS PAGE
// ======================
app.get("/address", (req, res) => {

    const {
        price,
        name,
        image1
    } = req.query;



    res.render("address.ejs", {

        price,
        name,
        image1

    });

});



// ======================
// PAYMENT PAGE
// ======================
app.get("/address/payment", (req, res) => {

    const {
        price,
        name,
        image1
    } = req.query;



    res.render("payment.ejs", {

        key_id:
        process.env.RAZORPAY_KEY_ID,

        price,
        name,
        image1

    });

});



// ======================
// SUCCESS PAGE
// ======================

app.get("/success", (req, res) => {

    res.send(
        "Payment Successful ✅"
    );

});

//  Payment QR

app.post("/qr", (req, res) => {
    res.render("pqr.ejs");
});



// ======================
// SERVER
// ======================

app.listen(port, () => {

    console.log(
        `Port listening on ${port}`
    );

});