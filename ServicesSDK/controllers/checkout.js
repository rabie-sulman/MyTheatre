const createBooking = (inputs, template, callback, checkoutService) => {
  const { channelId, reference } = inputs;
  const billingAddress = {
    countryCode: 'UK',
  };
  const shopper = {
    firstName: 'First Name',
    lastName: 'Last Name',
  };
  const deliveryMethod = 'C';

  checkoutService.createOrder({
    channelId,
    reference,
    billingAddress,
    redirectUrl: 'https://example.com',
    shopper,
    deliveryMethod,
  }).then(data => {
    checkoutService.confirmBooking(reference, channelId, data.paymentId, agentDetails).then(result => {
      console.log(result);
      callback.render(template, result);
    }).catch((err) => {
      console.log(err.message);
      callback.render("error", {
        messages: ["Error fetching performance availability"],
      })
    });
  }).catch((err) => {
    console.log(err.message);
    callback.render("error", {
      messages: ["Error fetching performance availability"],
    })
  });
};

const agentDetails = {
  agentId: 'ENC',
  agentPassword: 'encore',
}

module.exports.createBooking = createBooking;
