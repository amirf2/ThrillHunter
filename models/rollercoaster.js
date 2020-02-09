const mongoose 	 = require("mongoose");

const rollerCoasterSchema = new mongoose.Schema({
	name: String,
	image: String,
	info: String,
	seatingType: String,
	speed: String,
	height: String,
	loops: String,
	location:{
		park: String,
		country: String
	},
	score: String,
	rank: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	moreImages:[String]
});


module.exports = mongoose.model("RollerCoaster",rollerCoasterSchema);
