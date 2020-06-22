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
      callback.render(template, result);
    }).catch((err) => {
      callback.render('error', {
        messages: [err.message],
      })
    });
  }).catch((err) => {
    callback.render('error', {
      messages: [err.message],
    })
  });
};

const agentDetails = {
  agentId: 'ENC',
  agentPassword: 'encore',
}

module.exports.createBooking = createBooking;
