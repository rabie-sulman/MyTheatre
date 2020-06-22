const {URL} = require('url');
var request = require('request-promise');
var xml2js = require('xml2js');
const staticCustomerData = require('../customerData.json');


var xmlBuilder = new xml2js.Builder();
var parser = new xml2js.Parser();

var authURI = 'booking/authenticate';
var basketURI = 'booking/basket';
var bookingURI = 'booking/book';

const pageTitle = 'Basket page';

const getAuthString = (apiCredentials) => {
  return Buffer.from(apiCredentials.affiliateId + ':' + apiCredentials.affiliatePassword);
}
const addToBasket = (inputs, template, callback, basketService) => {
  const { productId, venueId, quantity, date, aggregateReference, channelId } = inputs;
  const reservations = [{
    productId,
    venueId,
    quantity: parseInt(quantity),
    date,
    items: [
      {
        aggregateReference
      }
    ]
  }];

  basketService.createBasket({
    channelId,
    reservations,
  }).then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log(err.message);
    callback.render('error', {
      title: pageTitle,
      messages: ['Error fetching performance availability'],
    })
  });
}

const deleteBasket = (host, inputs, apiCredentials, template, callback) => {
  var authBody = getAuthBody(apiCredentials);
  var authString = getAuthString(apiCredentials);
  var url = new URL(authURI, host);
  request({
    'method': 'POST',
    'uri': url.toString(),
    'json': false,
    'headers': {
      'content-type': 'application/xml',
      'Authorization': 'Basic ' + authString.toString('base64')
    },
    body: authBody
  }).then(function (data) {
    parser.parseString(data, function (err, result) {
      var deleteBasketBody = getDeleteBasketBody(inputs, apiCredentials, result.agent.session);
      var url = new URL(basketURI, host);
      request({
        'method': 'DELETE',
        'uri': url.toString(),
        'json': false,
        'headers': {
          'content-type': 'application/xml',
          'Authorization': 'Basic ' + authString.toString('base64')
        },
        body: deleteBasketBody
      }).then(function (data) {
        console.log('deleted');
        callback.render(template, {
          title: pageTitle,
          messages: ['booking: <' + inputs.reference + '> deleted'],
        })
      }).catch(function (err) {
        console.log(err.message);
        callback.render(template, {
          title: pageTitle,
          messages: ['unable to delete booking: <' + inputs.reference + '>'],
        })
      });
    });
  }).catch(function (err) {
    console.log(err.message);
    callback.render('error', {
      title: pageTitle,
      messages: ['error in auth - try again'],
    })
  });
}

const createBooking = (host, inputs, apiCredentials, template, callback) => {
  var authBody = getAuthBody(apiCredentials);
  var authString = getAuthString(apiCredentials);
  var url = new URL(authURI, host);
  request({
    'method': 'POST',
    'uri': url.toString(),
    'json': false,
    'headers': {
      'content-type': 'application/xml',
      'Authorization': 'Basic ' + authString.toString('base64')
    },
    body: authBody
  }).then(function (data) {
    parser.parseString(data, function (err, result) {
      var createBookingBody = getCreateBookingBody(inputs, apiCredentials, result.agent.session, staticCustomerData);
      var url = new URL(bookingURI, host);
      request({
        'method': 'POST',
        'uri': url.toString(),
        'json': false,
        'headers': {
          'content-type': 'application/xml',
          'Authorization': 'Basic ' + authString.toString('base64')
        },
        body: createBookingBody
      }).then(function (data) {
        console.log('booked!');
        callback.render(template, {
          title: pageTitle,
          messages: ['booking: <' + inputs.reference + '> has been successful!'],
        })
      }).catch(function (err) {
        console.log(err.message);
        callback.render(template, {
          title: pageTitle,
          messages: ['unable to delete booking: <' + inputs.reference + '>'],
        })
      });
    });
  }).catch(function (err) {
    console.log(err.message);
    callback.render('error', {
      title: pageTitle,
      messages: ['error in auth - try again'],
    })
  });
}

const getAuthBody = (apiCredentials) => {
  return xmlBuilder.buildObject({
    agent: {
      $: {
        id: apiCredentials.agentId
      },
      password: apiCredentials.agentPassword
    }
  });
}
const getDeleteBasketBody = (inputs, apiCredentials, session) => {
  return xmlBuilder.buildObject({
    basket: {
      transaction: {
        $: {
          reference: inputs.reference
        },
        password: inputs.password,
      },
      reservations: {
        reservation: {
          $: {
            id: 1
          }
        }
      },
      agent: {
        $: {
          id: apiCredentials.agentId
        },
        session: session,
        partner: apiCredentials.affiliateId
      },
    }
  });
}

const getCreateBookingBody = (inputs, apiCredentials, session, customer) => {
  return xmlBuilder.buildObject({
    booking: {
      transaction: {
        $: {
          reference: inputs.reference
        },
        password: inputs.password,
      },
      customer: {
        title: customer.title,
        firstName: customer.title,
        lastName: customer.lastName,
        email: customer.email,
        address: {
          $: {
            type: customer.address.type,
          },
          line1: customer.address.line1,
          line2: customer.address.line2,
          city: customer.address.city,
          county: customer.address.county,
          postcode: customer.address.postcode,
          country: customer.address.country,
        },
        phone: customer.phone,
        mail: {
          $: {
            type: customer.mail.type,
          },
        }
      },
      agent: {
        $: {
          id: apiCredentials.agentId
        },
        session: session,
        partner: apiCredentials.affiliateId
      },
    }
  });
}
const getAddToBasketBody = (inputs, apiCredentials, session) => {
  var seatKey = new Buffer(inputs.seatKey, 'base64');
  seatKey = seatKey.toString('ascii');
  return xmlBuilder.buildObject({
    basket: {
      product: {
        $: {
          id: inputs.productId
        },
        type: 'show',
        venue: {
          $: {
            id: inputs.venueId
          },
        },
        performance: {
          $: {
            type: 'A'
          },
        },
        date: inputs.date,
        quantity: inputs.ticketQuantity,
        startFrom: inputs.startFrom,
        seat: {
          $: {
            key: seatKey
          }
        }
      },
      agent: {
        $: {
          id: apiCredentials.agentId
        },
        session: session,
        partner: apiCredentials.affiliateId
      },
    }
  });
}

module.exports.addToBasket = addToBasket;
module.exports.deleteBasket = deleteBasket;
module.exports.createBooking = createBooking;
