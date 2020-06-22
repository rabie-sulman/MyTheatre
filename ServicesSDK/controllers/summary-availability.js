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

    callback.render(template, { inputs, listOfAvailableTime });
  }).catch((err) => {
    console.log(err.message);
    callback.render("error", {
      messages: ["Error fetching performance availability"],
    })
  });
}

module.exports.getAvailability = getAvailability;
