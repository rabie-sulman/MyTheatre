// staging environment
const env = {
    inventory_host: 'https://inventory-service.stagingtixuk.io/',
    eapi_host: 'https://eapi.staging.aws.encoretix.co.uk/api/v1/xtest',
    affiliateId: 'encoretickets'
};

const inputs = {
    productId: 1587,
    venueId: 138,
    ticketQuantity: 2,
    periodAvailability: 7 //days
}

module.exports.env = env;
module.exports.inputs = inputs;