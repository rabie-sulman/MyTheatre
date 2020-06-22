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

    callback.render(template, { inputs, availabilityData, title: 'Product page', subtitle: 'Available dates for show:' });
  }).catch((err) => {
    console.log(err.message);
    callback.render('error', {
      title: 'Product page',
      messages: ['Error fetching performance availability'],
    })
  });
}

const processData = (data) => (
  data.getAreas().map(area => {
    const areaName = area.getName();

    const groupings = area.getGroupings().map(group => {
      const groupIdentifier = group.getGroupIdentifier();
      const prices = group.getPricing();
      const seats = group.getSeats();
      const seatLumps = group.getSeatLumps().map(seatLump => {
        const seatIdentifiers = seatLump.getSeatIdentifiers();
        const aggregateReferences = seats
          .filter(seat => seatIdentifiers.includes(seat.getSeatIdentifier()))
          .map(seat => seat.getAggregateReference());

        return {
          seatIdentifiers,
          aggregateReferences,
        };
      });

      return {
        groupIdentifier,
        prices,
        seatLumps,
      }
    })

    return {
      areaName,
      groupings,
    }
  })
)

module.exports.getPerformance = getPerformance;
