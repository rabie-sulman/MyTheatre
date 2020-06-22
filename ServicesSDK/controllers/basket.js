const addToBasket = (inputs, template, callback, basketService) => {
  const { productId, venueId, quantity, date, items, channelId } = inputs;
  const reservations = [{
    productId,
    venueId,
    quantity: parseInt(quantity),
    date,
    items,
  }];

  basketService.createBasket({
    channelId,
    reservations,
  }).then(data => {
    callback.render(template, processData(data));
  }).catch((err) => {
    console.log(err.message);
    callback.render('error', {
      title: pageTitle,
      messages: ['Error fetching performance availability'],
    })
  });
}

const deleteItem = (inputs, template, callback, basketService) => {
  const { reference, itemId } = inputs;

  basketService.removeItem(
    reference,
    parseInt(itemId),
  ).then(data => {
    callback.render(template, processData(data));
  }).catch((err) => {
    console.log(err.message);
    callback.render("error", {
      messages: ["Error fetching performance availability"],
    })
  });
}

const processData = (data) => {
  const items = data.getItemsCollection().getItems().map(item => ({
    productId: item.getProductId(),
    productName: item.getProductName(),
    venueId: item.getVenueId(),
    salePrice: item.getSalePrice(),
    totalPrice: item.getTotalPrice(),
    date: item.getRawDate(),
    seats: item.getSeats(),
    quantity: item.getQuantity(),
    id: item.getId(),
  }));

  return {
    reference: data.getReference(),
    checksum: data.getChecksum(),
    items
  };
}

module.exports.addToBasket = addToBasket;
module.exports.deleteItem = deleteItem;
