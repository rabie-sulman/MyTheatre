const express = require('express');
const qs = require('qs');
const path = require('path');
const moment = require('moment');
const basket = require('./controllers/basket');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('query parser', function (str) {
    return qs.parse(str, { decoder: function (s) { return decodeURIComponent(s); } });
});
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || '3000';
var config = require('./config');
app.set(config, config);

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', subtitle: 'Start your journey, here!' });
});

app.get('/product-external', (req, res) => {
    const inputs = config.inputs;
    const inventorySettings = config.settings.inventory;
    const configuration = {
        productId: inputs.productId,
        venueId: inputs.venueId,
        quantity: inputs.quantity,
        fromDate: moment().toString('YYYYMMDD'),             // today
        toDate: moment().add(1, 'weeks').format('YYYYMMDD'), // a week from now
        productType: inputs.productType,
        affiliateId: config.settings.affiliateId,
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
    const inventorySettings = config.settings.inventory;
    const configuration = {
        productId: inputs.productId,
        venueId: inputs.venueId,
        quantity: inputs.quantity,
        fromDate: moment().toString('YYYYMMDD'),             // today
        toDate: moment().add(1, 'weeks').format('YYYYMMDD'), // a week from now
        productType: inputs.productType,
        affiliateId: config.settings.affiliateId,
        apiPath: inventorySettings.host,
        widgetVersion: inventorySettings.widgetVersion,
    };

    res.render('product', {
        configuration,
        title: 'Product page',
        subtitle: 'Choose date:'
    });
});

app.get('/seating-plan-external', (req, res) => {
    const venueSettings = config.settings.venue;
    const configuration = {
        channelId: config.settings.channelId,
        apiPath: venueSettings.host,
        widgetVersion: venueSettings.widgetVersion,
        actionUrl: venueSettings.redirectUrl,
    };

    res.render('seating-plan-external', {
        configuration,
        title: 'Seat Plan page',
        subtitle: 'Choose seats:',
    });
});

app.get('/seating-plan', (req, res) => {
    const venueSettings = config.settings.venue;
    const configuration = {
        channelId: config.settings.channelId,
        apiPath: venueSettings.host,
        widgetVersion: venueSettings.widgetVersion,
    };

    res.render('seating-plan', {
        configuration,
        title: 'Seat Plan page',
        subtitle: 'Choose seats:',
    });
});

app.get('/addToBasket', (req, res) => {
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
    basket.addToBasket(host, addToBasketInputs, apiCredentials, 'basket', res);
});

app.get('/deleteBasket', (req, res) => {
    var host = config.env.eapi.host;
    var apiCredentials = config.env.eapi;
    var deleteBasketInputs = {
        reference: req.query.reference,
        password: req.query.password,
    };
    basket.deleteBasket(host, deleteBasketInputs, apiCredentials, 'index', res);
});

app.get('/createBooking', (req, res) => {
    var host = config.env.eapi.host;
    var apiCredentials = config.env.eapi;
    var createBooking = {
        reference: req.query.reference,
        password: req.query.password,
    };
    basket.createBooking(host, createBooking, apiCredentials, 'booking', res);
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
