function carouselColumnTemplete(restaurant) {
	return {
		imageBackgroundColor: '#FFFFFF',
		// title has to be less than 40 characters
		title: restaurant.name.length > 40 ? restaurant.name.slice(0, 40) : restaurant.name,
		text: `Rating: ${restaurant.rating} \nOpening now: ${
			restaurant.opening_hours ? restaurant.opening_hours.open_now : false ? 'Yes' : 'No'
		}`,
		actions: [
			{
				type: 'postback',
				label: 'Add to favourite',
				data: `action=add&itemid=${restaurant.place_id}`,
			},
			{
				type: 'uri',
				label: 'Details',
				uri: restaurant.url,
			},
		],
	};
}

module.exports = carouselColumnTemplete;
