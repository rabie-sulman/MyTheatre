const { URL } = require('url');
var moment = require('moment');
var request = require('request-promise');

var availURI = '/api/v3/availability/products/productId/quantity/ticketQuantity/seats';

const getPerformance = (host, inputs, template, callback) => {
    availURI = availURI.replace('productId', inputs.productId);
    availURI = availURI.replace('ticketQuantity', inputs.ticketQuantity);
    var affiliateId = inputs.affiliateId;
    var queryParam = { 'date': inputs.date, 'time': inputs.time};

    var url = new URL(availURI, host);
    request({
        'method': 'GET', 
        'uri': url.toString(),
        'json': true,
        'headers': {
            'content-type': 'application/json',
            'origin': '*',
            'via': 'demo',
            'affiliateId': affiliateId
        },
        qs: queryParam
    }).then(function (data) {
        callback.render(template, {
            request: data.request,
            response: processData(data),
            title: 'Product page',
            subtitle: 'Available dates for show:',
        })
    }).catch(function (err) {
        callback.render('error', {
            title: 'Product page',
            messages: [err.message],
        })
});
}
/*
* rules: inventory call will return all seats avail but 'bookable' seats are indicated in 'seatsLumps'
*        add to basket should be done by using start of avail lump (seatKey)
*/
function processData(data) {
    var results = [];
    data.response.areas.forEach(area => {
        area.groupings.forEach(grouping => {
            grouping.seatLumps.forEach(seatLump => {
                const seats = grouping.seats.filter(seat => [seatLump.seats[0]].includes(seat.seatIdentifier)); // filter the 1st in the lump only
                
                results.push({
                    seats: seats,
                    lump: seatLump.seats.join(', '),
                    lumpIdentifier: grouping.aggregateReference
                });
            })
        })
    });
    return (results);
}

module.exports.getPerformance = getPerformance;