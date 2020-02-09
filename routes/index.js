const express       = require("express"),
      router        = express.Router({mergeParams: true}),
	  passport      = require("passport"),
	  User          = require("../models/user");

/*---------------------------------------------------------------------
                        Auth Route
 ---------------------------------------------------------------------*/

router.get("/register", (req,res) => {
	res.render("register");
})

router.post("/register", (req,res) => {
	User.register(new User(
	{
		username: req.body.username
	}), req.body.password, (err, user) => {
		if (err){
			//req.flash("error",err.message);
			return res.render("register", {error: err.message});
		} else {
			passport.authenticate("local")(req,res, () => {
				req.flash("success",`${user.username}, welcome to ThrillHunter :) `);
				res.redirect("/rollercoasters");
			});
		}
	});
});

router.get("/login", (req, res) =>{
	res.render("login");
})

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/rollercoasters",
		failureRedirect: "/login",
		failureFlash: 'Invalid username or password.'
	}), (req, res) =>{
			res.render("login");
});

router.get("/logout", (req, res) =>{
	req.logout();
	req.flash("success", "Logged out");
	res.redirect("/rollercoasters");
})


/*---------------------------------------------------------------------
                        Index Route
 ---------------------------------------------------------------------*/

router.get("/", (req,res) => {
	res.render("landing");
}); 


module.exports = router;

