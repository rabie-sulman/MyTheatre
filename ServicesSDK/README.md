# MyTheatre app with Services SDK
This is a mock website which integrates with TTE API Services SDK and runs a user journey from stock availability until creating a booking. The static config will run for the show "Wicked" as follows:
- get a week's availability from today for the requested quantity - [Inventory Services - getSummaryAvailability()](https://www.npmjs.com/package/tte-api-services#inventory-service)  
- get performance seats availability for the wanted quantity - [Inventory Services - getPerformanceAvailability()](https://www.npmjs.com/package/tte-api-services#inventory-service)  
- create basket - [Basket Services - createBasket()](https://www.npmjs.com/package/tte-api-services#basket-service)
- remove item from the basket - [Basket Services - removeItem()](https://www.npmjs.com/package/tte-api-services#basket-service)
- create booking, this will create new Order, get new paymentId and confirm booking -[Checkout Services - createOrder(), confirmBooking()](https://www.npmjs.com/package/tte-api-services#checkout-service) 

For the purpose of this demo, the mock site uses static data for environment and data inputs in `config.js` as follows:

```javascript
const settings = {
  affiliateId: '',
  channelId: '',
  environment: 'staging',
};

const inputs = {
  productId: 1587,
  venueId: 138,
  quantity: 2,
}

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
}

module.exports.settings = settings;
module.exports.inputs = inputs;
module.exports.bookingSettings = bookingSettings;
```
The values left as empty `''` are the API credentials which Encore will provide. The API hosts are environment-specific.

#### The inputs are:
- `productId`: is the Encore ID for "Wicked"
- `venueId`: is the Encore ID for "Apollo Victoria Theatre"
- `quantity`: is the wanted number of tickets (this will affect the availability calls - so they need to be dynamic)

For creating booking, the API will require customer details in a static object `bookingSettings`.

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
- To confirm a booking with an agent that is "on account" get additional authorization details `agentId` and `agentPassword` - [more info here](https://developer.encore.co.uk/checkout-agent-support)
- Copy `config.js.dist` to `config.js` and use the above details to fill empty agentDetails fields in the `bookingSettings` object
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

