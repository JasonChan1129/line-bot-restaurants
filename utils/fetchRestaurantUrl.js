require('dotenv').config();
const axios = require('axios');

async function fetchRestaurantUrl(place_id) {
	const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=url&key=${process.env.GOOGLE_API_KEY}`;
	try {
		const response = await axios.get(url);
		const result = response.data.result;
		return result.url;
	} catch (error) {
		console.log(error);
	}
}

module.exports = fetchRestaurantUrl;
