const moment = require('moment');

const getAvailability = (inputs, template, callback, inventoryService) => {
  const { affiliateId, productId, quantity, fromDate, toDate } = inputs;

  inventoryService.getSummaryAvailability(
    affiliateId,
    productId,
    quantity,
    fromDate,
    toDate,
  ).then((data) => {
    const listOfAvailableTime = data.getCollection().map(availabilityItem => (
      {
        datetime: availabilityItem.getRawDateTime(),
        date: moment(availabilityItem.getRawDateTime()).utc().format('YYYYMMDD'),
        time: moment(availabilityItem.getRawDateTime()).utc().format('HHmm'),
      }
    ));

    callback.render(template, { inputs, listOfAvailableTime, title: 'Product page' });
  }).catch((err) => {
    console.log(err.message);
    callback.render("error", {
      title: 'Product page',
      messages: ["Error fetching performance availability"],
    })
  });
}

module.exports.getAvailability = getAvailability;
