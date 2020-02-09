
const  RollerCoaster  = require("../models/rollercoaster"),
       Comment        = require("../models/comment");
		  
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	} else{
        req.flash("error", "You need to be login in order to do that");
		res.redirect("/login");
	}	
}


function checkCommentOwnership (req,res,next) {
	if (req.isAuthenticated()){
		Comment.findById(req.params.commentId, (err, foundComment) => {
			if (err){
				req.flash("error", "Rolleroaster not found");
				res.redirect("back");
				console.log(err);
			} else {
				if (foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You dont have permission to do that");
					res.redirect("back");
				}
			}
		})
	} else {
        req.flash("error", "You need to be login in order to do that");
		res.redirect("back");
	}
}

module.exports = {
	isLoggedIn,
	checkCommentOwnership
}

