const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
	name: { type: String, require: true },
	url: { type: String, require: true },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
