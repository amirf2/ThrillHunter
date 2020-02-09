const mongoose              = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	wishlist: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "RollerCoaster"
	}],
	experienced: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "RollerCoaster"
	}],
	
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);