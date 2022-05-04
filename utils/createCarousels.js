const columnTemplete = require('./carouselColumnTemplete');

function splitRestaurants(restaurants) {
	const maxNumOfItems = 10;
	const totalItems = restaurants.length;
	const restaurantsArray = [];
	let start = 0;
	while (start < totalItems) {
		restaurantsArray.push(restaurants.slice(start, start + maxNumOfItems));
		start += maxNumOfItems;
	}
	return restaurantsArray;
}

function createColumns(restaurantsArray) {
	const columnsArray = [];
	for (let i = 0; i < restaurantsArray.length; i++) {
		columnsArray.push(
			restaurantsArray[i].map(restaurant => {
				// item.opening_hours.open_now maybe undefined, so have to handle that case
				return columnTemplete(restaurant);
			})
		);
	}
	return columnsArray;
}

function createCarousels(restaurants) {
	// first slice the restaurants data into arrays of at most 10 items
	const restaurantsArray = splitRestaurants(restaurants);
	// for each sliced array, create list of carousel columns
	const columnsArray = createColumns(restaurantsArray);
	// create corousel templetes
	const carouselTempleteArray = columnsArray.map(row => {
		return {
			type: 'template',
			altText: 'this is a carousel template',
			template: {
				type: 'carousel',
				columns: row,
				imageAspectRatio: 'rectangle',
				imageSize: 'cover',
			},
		};
	});
	return carouselTempleteArray;
}

module.exports = createCarousels;
