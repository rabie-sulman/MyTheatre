/**
 * Required External Modules
 */
const express = require('express');
const qs = require('qs');
const path = require('path');
const moment = require('moment');
const { inventoryService, basketService } = require('tte-api-services/node');
const summaryAvail = require('./controllers/summaryAvail');
const performance = require('./controllers/performance');
const basketController = require('./controllers/basket');

/**
 * App Variables
 */
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('query parser', str => (
  qs.parse(str, {
    decoder: s => decodeURIComponent(s)
  })
));
app.use(express.static(path.join(__dirname, 'public')));

/**
 *  App Configuration
 */
const port = process.env.PORT || '3000';
const config = require('./config');
app.set(config, config);

/**
 * App Services
 */
const inventory = inventoryService.create(config.settings.environment);
const basket = basketService.create(config.settings.environment);

/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
  res.render('index', {title: 'Home', subtitle: 'Start your journey, here!'});
});

app.get('/availability', (req, res) => {
  const { affiliateId, environment } = config.settings;
  const { quantity, productId } = config.inputs;
  const availabilityInputs = {
    affiliateId,
    productId,
    quantity,
    fromDate: moment().toString('YYYYMMDD'),             // today
    toDate: moment().add(1, 'weeks').format('YYYYMMDD'), // a week from now
    environment,
  };

  summaryAvail.getAvailability(availabilityInputs, 'availability', res, inventory);
});

app.get('/performance', (req, res) => {
  const { affiliateId, productId, quantity, date, time, datetime } = req.query;
  const availabilityInputs = {
    affiliateId,
    productId,
    quantity,
    date,
    time,
    datetime,
  };

  performance.getPerformance(availabilityInputs, 'performance', res, inventory);
});


app.get('/addToBasket', (req, res) => {
  const { productId, quantity, date, aggregateReference } = req.query;
  const { channelId } = config.settings;
  const { venueId } = config.inputs;
  const addToBasketInputs = {
    channelId,
    productId,
    quantity,
    aggregateReference,
    date,
    venueId,
  };

  basketController.addToBasket(addToBasketInputs, 'basket', res, basket);
});

app.get('/deleteBasket', (req, res) => {
  const host = config.env.eapi.host;
  const apiCredentials = config.env.eapi;
  const deleteBasketInputs = {
    reference: req.query.reference,
    password: req.query.password,
  };
  basketController.deleteBasket(host, deleteBasketInputs, apiCredentials, 'index', res);
});


app.get('/createBooking', (req, res) => {
  const host = config.env.eapi.host;
  const apiCredentials = config.env.eapi;
  const createBooking = {
    reference: req.query.reference,
    password: req.query.password,
  };
  basketController.createBooking(host, createBooking, apiCredentials, 'booking', res);
});

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
