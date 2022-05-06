const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
	line_id: {
		type: String,
		require: true,
	},
	restaurant_name: {
		type: String,
		require: true,
	},
	restaurant_url: {
		type: String,
	},
});

module.exports = mongoose.model('Favourite', favouriteSchema);
