# MyTheatre
This is a mock website which integrates with Encore's APIs and runs a user journey from stock availability until creating a booking. The static config will run for the show "Wicked" as follows:
- get a week's availability from today for the requested quantity - [inventory API - summary availability](https://developer.encore.co.uk/inventory-service/api-reference#/default/get_api_v3_availability_products__productId__quantity__quantity__from__fromDate__to__toDate_)
- get performance seats' availability for the wanted quantity - [inventory API - seats availability](https://developer.encore.co.uk/inventory-service/api-reference#/default/get_api_v3_availability_products__productId__quantity__quantity__seats)
- create and add seats to basket after agent authentication - [EAPI - create/add to basket ](https://developer.encore.co.uk/entertain-api/booking-api-basket-and-booking#add-to-basket)
- delete reservation from basket. For the purpose of this demo, it is a static call to delete the only added reservation - [EAPI - delete from basket](https://developer.encore.co.uk/entertain-api/booking-api-basket-and-booking#delete-from-basket)
- create booking. This will confirm reservation with the venue, capture customer details and add booking to the agent account to be invoiced. [EAPI - create booking](https://developer.encore.co.uk/entertain-api/booking-api-basket-and-booking#create-booking)

For the purpose of this demo, the mock site uses static data for environment and data inputs in `config.js` as follows:

```javascript
const settings = {
  affiliateId: '',
  channelId: '',
  environment: 'staging',
  inventory: {
    host: 'https://inventory-service.stagingtixuk.io',
    widgetVersion: 'vLatest',
  },
  venue: {
    host: 'https://venue-service.stagingtixuk.io',
    widgetVersion: 'vLatest',
    redirectUrl: 'https://encoretickets.co.uk',
  },
};

const inputs = {
  productId: 1587,
  venueId: 138,
  quantity: 2,
};

const bookingSettings = {
  billingAddress: {
    countryCode: 'UK',
  },
  shopper: {
    firstName: 'First Name',
    lastName: 'Last Name',
  },
  redirectUrl: 'https://example.com',
  deliveryMethod: 'C',
  agentDetails: {
    agentId: '',
    agentPassword: '',
  },
};

module.exports.settings = settings;
module.exports.inputs = inputs;
module.exports.bookingSettings = bookingSettings;

```
The values left as empty `''` are the API credentials which Encore will provide. The API hosts are environment-specific.

#### The inputs are:
- `productId`: is the Encore ID for "Wicked"
- `venueId`: is the Encore ID for "Apollo Victoria Theatre"
- `quantity`: is the wanted number of tickets (this will affect the availability calls - so they need to be dynamic)

For creating booking, the API will require customer details, for the purpose of the example, a static json object in `customerData.json` which will be used rather than using a form to capture the data. 

note: once deployed to prod, hosts and credentials will change and the `env` will have to change from `test` to `live`
### Technical details
#### environment info
This demo was developed and run with:
- node (v13.3.0) and npm (6.13.2)
- macOS Catalina (10.15.2)

However, this demo should work on any OS with latest node installed. 
This application do not use environment variables but static `config.js` to make this simple and easy to test on multiple environments
#### Application tech stack
This application is built with `expressJS` (for routing) and `Pug`, formally known as `Jade` (template engine for view)
#### How to run
In order to run this demo, please do the following:
- Ask Encore to provide API's credentials for both the capability APIs (inventory) and the Entertain API (basket and booking)
- Copy `config.js.dist` to `config.js` and use the above credentials to fill in the empty credentials (see above description in code example)
- From your terminal, navigate to the code folder and run:
```sh
> npm i
```
this would install the application dependencies. Then start the application: 
```sh
> npm run dev
```
the website will run on your localhost port 3000: `http://localhost:3000/`
#### Happy path & errors
For the purpose of the demo, this website deals with happy paths and doesn't handle specific errors but catches generic errors and renders a static error template. You would be able to check logs in the terminal which you started the application on.

