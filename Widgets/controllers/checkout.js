const pageTitle = 'Booking page';

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
      const messages = [`Booking ${reference} was successfully confirmed`];

      callback.render(template, {
        result,
        messages,
        title: pageTitle,
        shopper,
        billingAddress,
      });
    }).catch((err) => {
      callback.render('error', {
        title: pageTitle,
        messages: [err.message],
      })
    });
  }).catch((err) => {
    callback.render('error', {
      title: pageTitle,
      messages: [err.message],
    })
  });
};

module.exports.createBooking = createBooking;
