function randomPickRestaurants(restaurantsList) {
	const collectionLength = restaurantsList.length;
	const randomIndex = Math.floor(Math.random() * collectionLength);
	const pickedRestaurant = restaurantsList[randomIndex];
	return pickedRestaurant;
}

module.exports = randomPickRestaurants;
