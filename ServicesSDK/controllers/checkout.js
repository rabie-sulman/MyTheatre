const createBooking = (inputs, template, callback, checkoutService) => {
  const { channelId, reference, bookingSettings } = inputs;
  const { billingAddress, redirectUrl, shopper, deliveryMethod, agentDetails} = bookingSettings;

  checkoutService.createOrder({
    channelId,
    reference,
    billingAddress,
    redirectUrl,
    shopper,
    deliveryMethod,
  }).then(data => {
    checkoutService.confirmBooking(
      reference,
      channelId,
      data.paymentId,
      agentDetails
    ).then(({ result }) => {
      callback.render(template, { result, reference });
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

module.exports.createBooking = createBooking;
