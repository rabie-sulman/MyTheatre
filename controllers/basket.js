const { URL } = require('url');
var request = require('request-promise');
var xml2js = require('xml2js');

var authURI = 'booking/authenticate';
var basketURI = 'booking/basket';

const addToBasket = (host, inputs, apiCredentials, template, callback) => {
    var authBody = authenticate(apiCredentials);
    // basketURI = basketURI.replace('productId', inputs.productId);
    // basketURI = basketURI.replace('ticketQuantity', inputs.ticketQuantity);
    // basketURI = basketURI.replace('fromDate', inputs.fromDate);
    // basketURI = basketURI.replace('toDate', inputs.toDate);
    // var affiliateId = inputs.affiliateId;
var authString = Buffer.from(apiCredentials.affiliateId + ':' + apiCredentials.affiliatePassword);
    var url = new URL(authURI, host);
    request({
        "method":"POST", 
        "uri": url.toString(),
        "json": false,
        "headers": {
            "content-type": "application/xml",
            "origin": "*",
            "via": "demo",
            "affiliateId": apiCredentials.affiliateId,
            "Authorization": "Basic " + authString.toString('base64')
        },
        body: authBody
    }).then(function (data) {
        console.log(data);
    }).catch(function (err) {
        console.log(err.message);
    });
}

function authenticate (apiCredentials) {
    var obj = {
        agent: {
            $: {
                id: apiCredentials.agentId
            },
            password: apiCredentials.agentPassword
        }
    };

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    return (xml);
}

module.exports.addToBasket = addToBasket;