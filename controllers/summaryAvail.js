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
        "method":"GET", 
        "uri": url.toString(),
        "json": true,
        "headers": {
            "content-type": "application/json",
            "origin": "*",
            "via": "demo",
            "affiliateId": affiliateId
        }
    }).then(function (data) {
        callback.render(template, {
            request: data.request,
            response: data.response,
        });
    }).catch(function (err) {
        console.log(err.message);
        callback.render("error", {
            messages: ["Error fetching performance availability"],
        })
    });
}

module.exports.getAvailability = getAvailability;