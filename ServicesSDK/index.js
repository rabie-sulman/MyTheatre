/**
 * Required External Modules
 */
const express = require('express');
const qs = require('qs');
const path = require('path');
const moment = require('moment');
const {
  inventoryService,
  basketService,
  checkoutService,
  contentService,
} = require('tte-api-services/node');
const summaryAvailability = require('./controllers/summary-availability');
const performanceController = require('./controllers/performance');
const basketController = require('./controllers/basket');
const checkoutController = require('./controllers/checkout');

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
app.use(express.urlencoded({extended: true}));

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
const checkout = checkoutService.create(config.settings.environment);
const content = contentService.create(config.settings.environment);

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
    fromDate: moment().format('YYYYMMDD'),             // today
    toDate: moment().add(1, 'weeks').format('YYYYMMDD'), // a week from now
    environment,
  };

  summaryAvailability.getAvailability(availabilityInputs, 'availability', res, inventory);
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

  performanceController.getPerformance(availabilityInputs, 'performance', res, inventory);
});

app.get('/addToBasket', (req, res) => {
  const { productId, quantity, date, aggregateReferences } = req.query;
  const items = aggregateReferences.split(',').map(aggregateReference => ({ aggregateReference }));
  const { channelId } = config.settings;
  const { venueId } = config.inputs;
  const addToBasketInputs = {
    channelId,
    productId,
    quantity,
    items,
    date,
    venueId,
  };

  basketController.addToBasket(addToBasketInputs, 'basket', res, basket, content);
});

app.get('/addCustomerDetails', (req, res) => {
  const { reference } = req.query;

  res.render('customer-details', {
    reference,
    title: 'Customer details',
    subtitle: 'Add customer details'
  });
});

app.get('/deleteItem', (req, res) => {
  const { reference, itemId } = req.query;
  const deleteBasketInputs = { reference, itemId };

  basketController.deleteItem(deleteBasketInputs, 'basket', res, basket);
});

app.post('/createBooking', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    telephoneNumber,
    line1,
    city,
    postalCode,
    countryCode,

  } = req.body;
  const { reference } = req.query;
  const { channelId } = config.settings;
  const { bookingData } = config;
  const bookingSettings = {
    ...bookingData,
    shopper: {
      firstName,
      lastName,
      email,
      telephoneNumber,
    },
    billingAddress: {
      line1,
      city,
      postalCode,
      countryCode,
    }
  }
  const createBookingInputs = { channelId, reference, bookingSettings };

  checkoutController.createBooking(createBookingInputs, 'booking', res, checkout);
});

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
