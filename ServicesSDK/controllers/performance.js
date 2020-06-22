const getPerformance = (inputs, template, callback, inventoryService) => {
  const {affiliateId, productId, quantity, date, time} = inputs;

  inventoryService.getPerformanceAvailability(
    affiliateId,
    productId,
    quantity,
    date,
    time,
  ).then((data) => {
    const availabilityData = processData(data);

    callback.render(template, { inputs, availabilityData });
  }).catch((err) => {
    console.log(err.message);
    callback.render("error", {
      messages: ["Error fetching performance availability"],
    })
  });
}

const processData = (data) => (
  data.getAreas().map(area => {
    const areaName = area.getName();
    const groupings = area.getGroupings().map(group => {
      const groupIdentifier = group.getGroupIdentifier();
      const prices = group.getPricing();
      const seats = group.getSeats().map(seat => {
        const aggregareReference = seat.getAggregateReference();
        const seatIdentifier = seat.getSeatIdentifier();

        return {
          aggregareReference,
          seatIdentifier,
        }
      });

      return {
        groupIdentifier,
        prices,
        seats,
      }
    })

    return {
      areaName,
      groupings,
    }
  })
)

module.exports.getPerformance = getPerformance;
