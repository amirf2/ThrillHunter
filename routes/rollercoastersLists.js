
const     express                = require("express"),
          router                 = express.Router({mergeParams: true}), 
	  RollerCoaster          = require("../models/rollercoaster"),
	  Comment                = require("../models/comment"),
	  User                   = require("../models/user"),
          fetch                  = require("node-fetch"),
	  middleware             = require("../middleware"),
	  {URLSearchParams}      = require('url'),
	  MAX_DATA_PAGES = 98;


router.get("/experienced", middleware.isLoggedIn, (req,res) => {
	User.findById(req.user.id).populate("experienced").exec(function(err, user){
		if (err){
			console.log(err);
		}
		res.render("../views/experienced/index", {experienced: user.experienced});
	});
});


router.post("/wishlist", middleware.isLoggedIn, (req,res) => {
	const {rc_id} = req.body;
		RollerCoaster.findById(rc_id, (err, rc) => {
			if (err){
				req.flash("error", "Roller coaster not found");
				console.log(err);
			}
			req.user.wishlist.push(rc);
			req.user.save(function(err, userUpdated){
				if (err){
					console.log(err);
					req.flash("error", "Couldn't save user");
				}
				User.findById(req.user.id).populate("wishlist").exec(function(err, user){
					if (err){
						console.log(err);
						req.flash("error", "User not found");
					}
					res.render("../views/wishlist/index", {wishlist: user.wishlist});
				});
			});;
		});
}); 

router.post("/experienced", middleware.isLoggedIn, (req,res) => {
	const {rc_id} = req.body;
		RollerCoaster.findById(rc_id, (err, rc) => {
			if (err){
				req.flash("error", "Roller coaster not found");
				console.log(err);
			}
			req.user.experienced.push(rc);
			req.user.save(function(err, userUpdated){
				if (err){
					console.log(err);
					req.flash("error", "Couldn't save user");
				}
				User.findById(req.user.id).populate("experienced").exec(function(err, user){
					if (err){
						console.log(err);
						req.flash("error", "User not found");
					}
					res.render("../views/experienced/index", {experienced: user.experienced});
				});
			});;
		});
}); 


router.get("/wishlist", middleware.isLoggedIn, (req,res) => {
	User.findById(req.user.id).populate("wishlist").exec(function(err, user){
		if (err){
			console.log(err);
			req.flash("error", "User not found");
			res.redirect("/");
		}
		res.render("../views/wishlist/index", {wishlist: user.wishlist});
	});
}); 


router.delete("/wishlist/edit", middleware.isLoggedIn, (req,res) => {
	const {rc_id} = req.body;
	RollerCoaster.findById(rc_id, (err, rc) => {
		if (err){
			req.flash("error", "Roller coaster not found");
			console.log(err);
			res.redirect("/wishlist");
		} else {
			User.findById(req.user.id,function(err, user){
				if (err){
					console.log(err);
					req.flash("error", "User not found");
				}
				let index = req.user.wishlist.indexOf(rc_id);
				user.wishlist.splice(index,1);
				user.save((err, userUpdated) => {
					if (err){
						console.log(err);
						req.flash("error", "Couldn't save user");
					}
					res.redirect("/wishlist");
				});
			});
		}
	});
}); 


router.delete("/experienced/edit", middleware.isLoggedIn, (req,res) => {
	const {rc_id} = req.body;
	RollerCoaster.findById(rc_id, (err, rc) => {
		if (err){
			console.log(err);
			req.flash("error", "Roller coaster not found");
			res.redirect("/experienced");
		} else {
			User.findById(req.user.id,function(err, user){
				if (err){
					console.log(err);
					req.flash("error", "User not found");
				}
				let index = req.user.experienced.indexOf(rc_id);
				user.experienced.splice(index,1);
				user.save((err, userUpdated) => {
					if (err){
						console.log(err);
						req.flash("error", "Couldn't save user");
					}
					res.redirect("/experienced");
				});
			});
		}
	});
}); 







module.exports=router;
