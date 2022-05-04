// require('dotenv').config();
const axios = require('axios');

async function fetchNearbyRestaurants(lat, lng) {
	console.log('fetch data');
	const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=restaurant&language=zh-tw&key=${process.env.GOOGLE_API_KEY}`;
	try {
		const response = await axios.get(url);
		const results = response.data.results;
		const sortedResults = results.sort((a, b) => {
			return a.rating > b.rating ? -1 : 1;
		});
		return sortedResults;
	} catch (error) {
		console.log(error);
	}
}

module.exports = fetchNearbyRestaurants;
