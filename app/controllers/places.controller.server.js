var secrets     = require("./../../config/secrets");

var googleMapsClient = require('@google/maps').createClient({
  key: secrets.googleAPIKey
});

function getLatLon(placeName, callback){ googleMapsClient.geocode({
    address:placeName
}, function(err, response){
    if(err){console.error(err)};
    let results = response.json.results[0];
    let latLon  = results.geometry.location;
    //console.log(JSON.stringify( results.geometry.location, null , "\t" ))
    callback(latLon);
});
}


exports.getPlacesNearAddress = function getPlacesNearAddress(placeName, placeType, callback){
   getLatLon(placeName, function(latLng){
        //console.log(latLng);
        googleMapsClient.placesNearby({
        location:[latLng.lat, latLng.lng],
        radius:500,
        type:placeType
        }, function (err, results){
            if(err){console.error(err)};
            callback(results);
            //console.log(JSON.stringify(results, null , "\t" ) );
        })

    }); 
}

//getPlacesNearAddress("Perth");
