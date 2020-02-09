const mongoose 		  = require("mongoose"),
	  RollerCoaster   = require("./models/rollercoaster"),
	  Comment 		  = require("./models/comment"),
	  fetch           = require("node-fetch"),
	  x_auth_token    = 'cca7da28-301b-4464-bd67-eea9d703c423',
	  base_url        = 'https://captaincoaster.com',
	  data            = 'hydra:member'
	  

function initDB(){
	
	Comment.deleteMany({},(err) => {
		if (err){
			console.log(err);
		}
	});
	
	RollerCoaster.deleteMany({},(err) => {
		if (err){
			console.log(err);
		}
	});
	
	for (i=1; i<=90; i++){
		const url = new URL(`${base_url}/api/coasters`);
		const params = {'exists[mainImage]': true, 'page': i};
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
		fetch(url, {
			method: 'GET',
			headers:{
				'X-Auth-Token': x_auth_token,
			}
		})
		.then((response) => {
			return response.json();
		})
		.then((myJson) => {
			var size = Object.keys(myJson[data]).length;
			for (let j=0; j<size; j++){
				const randomRollerCoaster = myJson[data][j];
				if (randomRollerCoaster.rank && randomRollerCoaster.rank<=100){	
					const imagesUrl = new URL(`${base_url}/api/images`);
					const imagesUrlparams = {'coaster': myJson[data][j].id};
					Object.keys(imagesUrlparams).forEach(key => imagesUrl.searchParams.append(key, imagesUrlparams[key]))
					fetch(imagesUrl, {
							method: 'GET',
							headers:{
								'X-Auth-Token': x_auth_token,
							}
					})
					.then((imagesRespone) => {
						return imagesRespone.json();
					})
					.then((myImagesJson) => {
						const imagesArray = [];
						myImagesJson[data].forEach((element)=>{
						imagesArray.push(`${base_url}/images/coasters/`+element.path)	
						});
						const locationUrl = new URL(`${base_url}${randomRollerCoaster.park['@id']}`);
						fetch(locationUrl, {
								method: 'GET',
								headers:{
									'X-Auth-Token': x_auth_token,
								}
						})
						.then((locationRespone) => {
							return locationRespone.json();
						})
						.then((myLocationJson) => {
							const {name, speed, height, inversionsNumber, park, score, rank, mainImage, seatingType} = randomRollerCoaster;


							const {country} = myLocationJson;
							let countryString = country.name.split('.')[1];
							countryString = countryString[0].toUpperCase() + countryString.substring(1);
							const newRc = {
							name: name,
							image: `${base_url}/images/coasters/${mainImage.path}`,
							speed: speed? ""+speed+" km/h": "unknown",
							height: height? ""+height+" meters" : "unknown",
							loops: inversionsNumber? ""+inversionsNumber: "unknown",
							location:{ 
								park: park.name,
								country: countryString
							},
							rank: ""+rank,
							seatingType: seatingType.name,
							moreImages: imagesArray
							}

							if (newRc.location.country==="Usa"){
								newRc.location.country="USA";
							}
							if (newRc.location.country==="Uk"){
								newRc.location.country="UK";
							}

							RollerCoaster.create(newRc, (err, newRc) => {
								if (err){
									console.log(err);
								}
							});

						});			
					});
				}
			}
		});
	}

}

module.exports = initDB;