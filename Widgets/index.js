/**
 * Required External Modules
 */
const express = require('express');
const qs = require('qs');
const path = require('path');
const moment = require('moment');
const { basketService, checkoutService } = require('tte-api-services/node');
const basketController = require('./controllers/basket');
const checkoutController = require('./controllers/checkout');

/**
 * App Variables
 */
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('query parser', function (str) {
  return qs.parse(str, { decoder: function (s) { return decodeURIComponent(s); } });
});
app.use(express.static(path.join(__dirname, 'public')));

/**
 *  App Configuration
 */
const port = process.env.PORT || '3000';
var config = require('./config');
app.set(config, config);

const basket = basketService.create(config.settings.environment);
const checkout = checkoutService.create(config.settings.environment);

/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', subtitle: 'Start your journey, here!' });
});

app.get('/product-with-external-basket', (req, res) => {
  const inputs = config.inputs;
  const inventorySettings = config.settings.inventory;
  const configuration = {
    productId: inputs.productId,
    venueId: inputs.venueId,
    quantity: inputs.quantity,
    fromDate: moment().format('YYYYMMDD'),             // today
    toDate: moment().add(1, 'weeks').format('YYYYMMDD'), // a week from now
    productType: inputs.productType,
    affiliateId: config.settings.affiliateId,
    apiPath: inventorySettings.host,
    widgetVersion: inventorySettings.widgetVersion,
  };

  res.render('product-with-external-basket', {
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
    fromDate: moment().format('YYYYMMDD'),             // today
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

app.get('/seating-plan-with-external-basket', (req, res) => {
  const venueSettings = config.settings.venue;
  const configuration = {
    channelId: config.settings.channelId,
    apiPath: venueSettings.host,
    widgetVersion: venueSettings.widgetVersion,
    actionUrl: venueSettings.redirectUrl,
  };

  res.render('seating-plan-with-external-basket', {
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

  basketController.addToBasket(addToBasketInputs, 'basket', res, basket);
});

app.get('/deleteItem', (req, res) => {
  const { reference, itemId } = req.query;
  const deleteBasketInputs = { reference, itemId };

  basketController.deleteItem(deleteBasketInputs, 'basket', res, basket);
});

app.get('/createBooking', (req, res) => {
  const { reference } = req.query;
  const { channelId } = config.settings;
  const { bookingSettings } = config;
  const createBookingInputs = { channelId, reference, bookingSettings };

  checkoutController.createBooking(createBookingInputs, 'booking', res, checkout);
});

app.get('/checkout', (req, res) => {
  const { reference: basketReference, failed } = req.query;
  const { channelId, checkout } = config.settings;
  const { redirectUrl, host: apiPath, widgetVersion, callbackHost } = checkout;
  const { shopper, billingAddress } = config.bookingSettings;
  const configuration = {
    channelId,
    basketReference,
    shopper,
    billingAddress,
    redirectUrl,
    apiPath,
    widgetVersion,
    failed,
    callbackUrls: {
      success: `${callbackHost}/success?reference=${basketReference}`,
      fail: `${callbackHost}/checkout?failed=true&reference=${basketReference}`
    },
  };

  res.render('checkout', {
    configuration,
    title: 'Checkout Page',
  });
});

app.get('/success', (req, res) => {
  res.render('booking', {
    result: 'success',
    messages: [`Booking ${req.query.reference} was successfully confirmed`],
    title: 'Confirmation Page',
  });
});

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
