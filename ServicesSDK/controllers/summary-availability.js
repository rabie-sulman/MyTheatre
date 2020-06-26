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
    const listOfAvailableTime = data.getCollection().map(availabilityItem => {
      const rawTime = availabilityItem.getRawDateTime();
      const rawTimeMoment = moment(rawTime).utc();

      return {
        datetime: rawTime,
        date: rawTimeMoment.format('YYYYMMDD'),
        time: rawTimeMoment.format('HHmm'),
      }
    });

    callback.render(template, { inputs, listOfAvailableTime, title: 'Available datetimes' });
  }).catch((err) => {
    callback.render('error', {
      title: 'Product page',
      messages: [err.message],
    })
  });
}

module.exports.getAvailability = getAvailability;
