
const express                = require("express"),
      router                 = express.Router({mergeParams: true}), 
	  RollerCoaster          = require("../models/rollercoaster"),
	  Comment                = require("../models/comment"),
      fetch                  = require("node-fetch"),
	  middleware             = require("../middleware/index"),
	  {URLSearchParams}      = require('url'),
	  MAX_DATA_PAGES = 98;


/*---------------------------------------------------------------------
                        RollerCoaster Routes
 ---------------------------------------------------------------------*/

router.get("/new",middleware.isLoggedIn, (req, res) => {
	res.render("rollercoasters/new");
});


router.get("/random",(req,res) =>{
	let randomRollerCoaster = "";
	const url = new URL("https://captaincoaster.com/api/coasters");
	const randomPage = Math.floor(Math.random() * MAX_DATA_PAGES)+1; // random between 1 to 98
	const params = {'page': randomPage};
	Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
	fetch(url, {
		method: 'GET',
		headers:{
			'X-Auth-Token': 'cca7da28-301b-4464-bd67-eea9d703c423',
		}
	})
  	.then((response) => {
    	return response.json();
  	})
  	.then((myJson) => {
		const size = Object.keys(myJson["hydra:member"]).length;
		if (size==0)
			res.redirect("/rollercoaster/random");
		const randomRcIndex = Math.floor(Math.random() * size); //random between 0 to 29 
		if (!myJson["hydra:member"][randomRcIndex].mainImage){
			for (let i=0; i<size; i++){
				if (myJson["hydra:member"][i].mainImage){
					randomRollerCoaster = myJson["hydra:member"][i];
				}
			}
		} else {
			randomRollerCoaster = myJson["hydra:member"][randomRcIndex];
		}
		if (randomRollerCoaster==""){
			console.log("oops");
		 	res.redirect("rollercoasters/random/index");
		}
		
		
		const locationUrl = new URL(`https://captaincoaster.com${randomRollerCoaster.park['@id']}`);
			fetch(locationUrl, {
					method: 'GET',
					headers:{
						'X-Auth-Token': 'cca7da28-301b-4464-bd67-eea9d703c423',
					}
			})
			.then((locationRespone) => {
				return locationRespone.json();
			})
			.then((myLocationJson) => {
				const {country} = myLocationJson;
				let countryNameTemp =  country.name.split('.')[1];
				const countryName =  countryNameTemp[0].toUpperCase() + countryNameTemp.substring(1);
					res.render("rollercoasters/random/index", {randomRollerCoaster: randomRollerCoaster, country: countryName==="Na"? "Unknown": countryName==="Usa"? "USA" : countryName==="Uk"? "UK" : countryName });

			});
		
		//console.log(randomRollerCoaster);
  	});
});



router.get("/:id", (req,res) => {
	const id = req.params.id;
	RollerCoaster.findById(id).populate("comments").exec((err, rollerCoaster) => {
		if (err){
			console.log(err)
		} else {
			res.render("rollercoasters/show", {rollerCoaster: rollerCoaster});
		}
	});
}); 
 

router.get("/", (req, res) => {
	RollerCoaster.find({}, (err, allRollerCoasters) => {
		if (err)
			console.log(err)
		else {
			res.render("rollercoasters/index",{rollerCoasters: allRollerCoasters});
		}
	});
}); 

 

router.post("/",middleware.isLoggedIn, (req,res) => {
	const {name,image,info} = req.body;
	const newRollerCoaster = {name: name, image: image, info: info};
	RollerCoaster.create(newRollerCoaster, (err, newAddedRollerCoaster) => {
		if (err){
			console.log(err);
		} else {
			res.redirect("/rollercoasters");
		}
	})
});


module.exports=router;
