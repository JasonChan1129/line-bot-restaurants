const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	line_id: { type: String, require: true },
	favourite: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
});

module.exports = mongoose.model('User', userSchema);
