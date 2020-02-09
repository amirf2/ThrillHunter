const express       = require("express"),
	  router        = express.Router({mergeParams: true}), 
	  RollerCoaster = require("../models/rollercoaster"),
	  Comment       = require("../models/comment"),
	  middleware    = require("../middleware/index");



/*---------------------------------------------------------------------
                        Comments Routes
 ---------------------------------------------------------------------*/

router.get("/new", middleware.isLoggedIn, (req,res) => {
	const id = req.params.id;
	RollerCoaster.findById(id, (err, rollerCoaster) => {
		if (err){
			req.flash("error", "Roller coaster not found");
			console.log(err)
		} else {
			res.render("comments/new", {rollerCoaster: rollerCoaster});
		}
	}); 
});


router.post("/", middleware.isLoggedIn, (req,res) => {
	//console.log(" i was in router.post/")
	const id = req.params.id;
	const {text} = req.body;
	const {_id, username} = req.user;
	const comment = {
		author: {
			id: _id,
			username: username
		},
		text: text
	};	
	RollerCoaster.findById(id, (err,rollerCoaster) => {
		if (err){
			req.flash("error", "Roller coaster not found");
			console.log(err);
		} else {
			Comment.create(comment, (err, newComment)=> {
				if (err){
					req.flash("error", "Creating comment failed");
					console.log(err);
				} else {
					rollerCoaster.comments.push(newComment);
					rollerCoaster.save();
					req.flash("success","Successfuly created a comment ")
					res.redirect("/rollercoasters/" +id);
				}
			});
		}
	});
});


// router.get("/edit", (req, res) => {
router.get("/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
	//console.log(" i was in router.get /:commentId/edit")
	const {id, commentId} = req.params;
	RollerCoaster.findById(id, (err, rollerCoaster) => {
		if (err){
			req.flash("error", "Roller coaster not found");
			console.log(err);
		} else {
			Comment.findById(commentId, (err, comment) => {
				if (err){
					req.flash("error", "Comment not found");
					console.log(err);
				}
				res.render("comments/edit", {rollerCoaster: rollerCoaster, comment: comment});	
			})
		}
	});
});


router.put("/:commentId", middleware.checkCommentOwnership, (req, res) => {
	//console.log(" i was in router.put (/:commentId)")
	const {id, commentId} = req.params;
	RollerCoaster.findById(id, (err, rollerCoaster) => {
		if (err){
			req.flash("error", "Roller coaster not found");
			console.log(err);
		} else {
			Comment.findByIdAndUpdate(commentId, req.body.comment, (err, comment) => {
				if (err){
					req.flash("error", "Couldn't find/update comment");
					console.log(err);
				} else{
					res.redirect("/rollercoasters/" + id);
				}
			});	
		}
	});
});

router.delete("/:commentId", middleware.checkCommentOwnership,  (req, res) => {
	const {id, commentId} = req.params;
	RollerCoaster.findById(id, (err, rollerCoaster) => {
		if (err){
			req.flash("error", "Roller coaster not found");
			console.log(err);
			res.redirect("back");
		} else {
			Comment.findByIdAndRemove(commentId, (err, comment) => {
				if (err){
					req.flash("error", "Couldn't find/update comment");
					console.log(err);
					res.redirect("back");
				} else{
					req.flash("success", "Successfuly deleted comment");
					res.redirect("/rollercoasters/" + id);
				}
			});	
		}
	});
});





module.exports = router;