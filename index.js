/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const moment = require("moment");
const sumaryAvail = require("./controllers/summaryAvail");
const performance = require("./controllers/performance");
const basket = require("./controllers/basket");

/**
 * App Variables
 */
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 *  App Configuration
 */
const port = process.env.PORT || "8000";
var config = require('./config');
app.set(config, config);

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/availability", (req, res) => {
    var host = config.env.inventory.host;
    var inputs = config.inputs;
    var availInputs = {
        productId: inputs.productId,
        ticketQuantity: inputs.ticketQuantity,
        fromDate: moment().format("YYYYMMDD"),               // today
        toDate: moment().add(1, 'weeks').format("YYYYMMDD"), // a week from now
        affiliateId: config.env.inventory.affiliateId
    };
    sumaryAvail.getAvailability(host, availInputs, "availability", res);
});

app.get("/performance", (req, res) => {
    var host = config.env.inventory.host;
    var date = req.query.date.replace(' ', '+'); //workaround because url query params removes "+"
    var availInputs = {
        productId: req.query.productId,
        ticketQuantity: req.query.quantity,
        date: moment(date).format('YYYYMMDD'),
        time: moment(date).format('HHmm'),
        affiliateId: req.query.affiliateId
    };
    
    performance.getPerformance(host, availInputs, "performance", res);
});


app.get("/addToBasket", (req, res) => {
    var host = config.env.eapi.host;
    var apiCredentials = config.env.eapi;
    var venueId = config.inputs.venueId;
    var date = req.query.date + 'T' + req.query.time;
    var availInputs = {
        productId: req.query.productId,
        ticketQuantity: req.query.quantity,
        date: moment(date).format('YYYY-MM-DD'),
        time: moment(date).format('HH:mm'),
        startFrom: req.query.number,
        venueId: venueId,
    };
    basket.addToBasket(host, availInputs, apiCredentials, "basket", res);
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});