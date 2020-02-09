const express 	              = require("express"),
	  app 		               = express(),
	  bodyParser               = require("body-parser"),
	  fetch                    = require("node-fetch"),
	  mongoose 	               = require("mongoose"),
	  RollerCoaster            = require("./models/rollercoaster"),
	  Comment                  = require("./models/comment"),
	  User                     = require("./models/user"),
	  initDB                   = require("./initDB"),
	  passport                 = require("passport"),
	  expressSession           = require("express-session"),
	  LocalStratagey           = require("passport-local"),
	  flash	                   = require("connect-flash"),
	  methodOverride           = require("method-override"),
	  {URLSearchParams}        = require('url');
		
const commentRoutes            = require("./routes/comments"),
	  rollerCoasterRoutes      = require("./routes/rollercoasters"),
	  indexRoutes              = require("./routes/index"),
	  rollerCoasterListsRoutes = require("./routes/rollercoastersLists");



const MongoDB_URL = process.env.DATABASEURL || "mongodb://localhost/thrill_hunter"
mongoose.connect(MongoDB_URL, {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
initDB();


/*---------------------------------------------------------------------
                        Passport Configurations
 ---------------------------------------------------------------------*/


/*---------------------------------------------------------------------
 | secret - 
 | resave - 
 | saveUninitialized - 
 ---------------------------------------------------------------------*/

app.locals.moment = require('moment');

app.use(expressSession({
	secret: process.env.SECRETKEY,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next(); 
});

app.use("/", indexRoutes);
app.use("/", rollerCoasterListsRoutes);
app.use("/rollercoasters",rollerCoasterRoutes);
app.use("/rollercoasters/:id/comments",commentRoutes);


app.listen(process.env.PORT,process.env.IP,() => {
	console.log("The ThrillHunter Server Has Started");
});

