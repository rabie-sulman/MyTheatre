const pageTitle = 'Basket page';

const addToBasket = (inputs, template, callback, basketService, contentService) => {
  const { productId, venueId, quantity, date, items, channelId } = inputs;
  const reservations = [{
    productId,
    venueId,
    quantity: parseInt(quantity),
    date,
    items,
  }];

  Promise.all([
    basketService.createBasket({
      channelId,
      reservations,
    }),
    contentService.getProduct(productId),
  ]).then(([basket, product]) => {
    callback.render(template, {
      ...processData([basket, product]),
      title: pageTitle
    });
  }).catch((err) => {
    callback.render('error', {
      title: pageTitle,
      messages: [err.message],
    })
  });
}

const deleteItem = (inputs, template, callback, basketService) => {
  const { reference, itemId } = inputs;

  basketService.removeItem(
    reference,
    parseInt(itemId),
  ).then(data => {
    callback.render(template, {
      ...getData(data),
      title: pageTitle,
    });
  }).catch((err) => {
    callback.render('error', {
      title: pageTitle,
      messages: [err.message],
    })
  });
}

const processData = ([ basket, product ]) => {
  const productName = product.getName();
  const venueName = product.getVenue().getName();

  return getData(basket, productName, venueName);
}

const getData = (basket, productName, venueName) => {
  const items = basket.getItemsCollection().getItems().map(item => ({
    productId: item.getProductId(),
    productName,
    venueId: item.getVenueId(),
    venueName,
    salePrice: item.getSalePrice(),
    totalPrice: item.getTotalPrice(),
    date: item.getRawDate(),
    seats: item.getSeats(),
    quantity: item.getQuantity(),
    id: item.getId(),
  }));

  return {
    reference: basket.getReference(),
    checksum: basket.getChecksum(),
    items
  };
}

module.exports.addToBasket = addToBasket;
module.exports.deleteItem = deleteItem;
