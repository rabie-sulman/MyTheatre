/**
 * Required External Modules
 */
const express = require("express");
var qs = require('qs');
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
app.set('query parser', function (str) {
    return qs.parse(str, { decoder: function (s) { return decodeURIComponent(s); } });
});
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
    res.render("index", { title: "Home", subtitle: 'Start your journey, here!' });
});

app.get("/availability", (req, res) => {
    var host = config.env.inventory.host;
    var inputs = config.inputs;
    var availInputs = {
        productId: inputs.productId,
        ticketQuantity: inputs.ticketQuantity,
        fromDate: '20200924',               // today
        toDate: '20200930', // a week from now
        affiliateId: config.env.inventory.affiliateId
    };
    sumaryAvail.getAvailability(host, availInputs, "availability", res);
});

app.get('/product-external', (req, res) => {
    const inputs = config.inputs;
    const inventorySettings = config.env.inventory;
    const configuration = {
        productId: inputs.productId,
        venueId: inputs.venueId,
        quantity: inputs.ticketQuantity,
        fromDate: '20200924',
        toDate: '20200930',
        productType: inputs.productType,
        affiliateId: inventorySettings.affiliateId,
        apiPath: inventorySettings.host,
        widgetVersion: inventorySettings.widgetVersion,
    };

    res.render('product-external', {
        configuration,
        title: 'Product page',
        subtitle: 'Choose date:'
    });
});

app.get('/product', (req, res) => {
    const inputs = config.inputs;
    const inventorySettings = config.env.inventory;
    const configuration = {
        productId: inputs.productId,
        venueId: inputs.venueId,
        quantity: inputs.ticketQuantity,
        fromDate: '20200924',
        toDate: '20200930',
        productType: inputs.productType,
        affiliateId: inventorySettings.affiliateId,
        apiPath: inventorySettings.host,
        widgetVersion: inventorySettings.widgetVersion,
    };

    res.render('product', {
        configuration,
        title: 'Product page',
        subtitle: 'Choose date:'
    });
});

app.get("/performance", (req, res) => {
    var host = config.env.inventory.host;
    var date = moment.parseZone(req.query.date);
    var availInputs = {
        productId: req.query.productId,
        ticketQuantity: req.query.quantity,
        date: moment(date).format('YYYYMMDD'),
        time: moment(date).format('HHmm'),
        affiliateId: req.query.affiliateId
    };
    
    performance.getPerformance(host, availInputs, "performance", res);
});

app.get('/seating-plan-with-summary', (req, res) => {
    const venueSettings = config.env.venue;
    const configuration = {
        channelId: venueSettings.channelId,
        apiPath: venueSettings.host,
        widgetVersion: venueSettings.widgetVersion,
        actionUrl: venueSettings.actionUrl,
    };

    res.render('seating-plan-with-summary', {
        configuration,
        title: 'Seat Plan page',
        subtitle: 'Choose seats:',
    });
});

app.get('/seating-plan-without-summary', (req, res) => {
    const venueSettings = config.env.venue;
    const configuration = {
        channelId: venueSettings.channelId,
        apiPath: venueSettings.host,
        widgetVersion: venueSettings.widgetVersion,
    };

    res.render('seating-plan-without-summary', {
        configuration,
        title: 'Seat Plan page',
        subtitle: 'Choose seats:',
    });
});

app.get("/addToBasket", (req, res) => {
    var host = config.env.eapi.host;
    var apiCredentials = config.env.eapi;
    var venueId = config.inputs.venueId;
    var date = req.query.date + 'T' + req.query.time;
    var addToBasketInputs = {
        productId: req.query.productId,
        ticketQuantity: req.query.quantity,
        seatKey: req.query.seatKey,
        date: moment(date).format('YYYY-MM-DD'),
        time: moment(date).format('HH:mm'),
        startFrom: req.query.number,
        venueId: venueId,
    };
    basket.addToBasket(host, addToBasketInputs, apiCredentials, "basket", res);
});

app.get("/deleteBasket", (req, res) => {
    var host = config.env.eapi.host;
    var apiCredentials = config.env.eapi;
    var deleteBasketInputs = {
        reference: req.query.reference,
        password: req.query.password,
    };
    basket.deleteBasket(host, deleteBasketInputs, apiCredentials, "index", res);
});

app.get("/createBooking", (req, res) => {
    var host = config.env.eapi.host;
    var apiCredentials = config.env.eapi;
    var createBooking = {
        reference: req.query.reference,
        password: req.query.password,
    };
    basket.createBooking(host, createBooking, apiCredentials, "booking", res);
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
