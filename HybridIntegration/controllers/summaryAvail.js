const { URL } = require('url');
var request = require('request-promise');

var availURI = '/api/v4/availability/products/productId/quantity/ticketQuantity/from/fromDate/to/toDate';

const getAvailability = (host, inputs, template, callback) => {
    availURI = availURI.replace('productId', inputs.productId);
    availURI = availURI.replace('ticketQuantity', inputs.ticketQuantity);
    availURI = availURI.replace('fromDate', inputs.fromDate);
    availURI = availURI.replace('toDate', inputs.toDate);
    var affiliateId = inputs.affiliateId;

    var url = new URL(availURI, host);
    request({
        'method':'GET', 
        'uri': url.toString(),
        'json': true,
        'headers': {
            'content-type': 'application/json',
            'origin': '*',
            'via': 'demo',
            'affiliateId': affiliateId
        }
    }).then(function (data) {
        callback.render(template, {
            request: data.request,
            response: data.response,
            title: 'Product page',
            subtitle: 'Available dates for show:',
        });
    }).catch(function (err) {
        callback.render('error', {
            title: 'Product page',
            messages: [err.message],
        })
    });
}

module.exports.getAvailability = getAvailability;