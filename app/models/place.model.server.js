'use strict'

var config  = require("./../../config/config");

// mongo
var mongo               = require("mongodb").MongoClient;
var mongoPort           = config.mongoPort;
var mongoDatabase       = config.mongoDatabase;
var collectionName      = "places";
var mongoUrl            =  `mongodb://localhost:${mongoPort}/${mongoDatabase}`;


class Place {
    constructor(geometry
        ,icon
        ,id
        ,name
        ,opening_hours
        ,photos
        ,place_id
        ,price_level
        ,rating
        ,reference
        ,scope
        ,types
        ,vicinity
        ,going){
        this.geometry =     geometry;
        this.icon =         icon;
        this.id =           id;
        this.name =         name;
        this.opening_hours = opening_hours;
        this.photos =       photos;
        this.place_id =     place_id;
        this.price_level =  price_level
        this.rating =       rating
        this.reference =    reference
        this.scope =        scope
        this.types =        types
        this.vicinity =     vicinity
        this.going =        going || [];
    }
}


var findByPlaceId = function(place_id, res){
    //console.log("Find by PlaceId called");
    var query = {place_id : place_id };
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);
        var results = collection.findOne({place_id: place_id},{}, function(err, result){
        //collection.find({}).toArray(function (err, results){
            if(err){console.error(err)};
            if (result){
                //console.log(result);
                //console.log("found user")
                db.close();
                return res(null, result );
            }else{
                //console.log("didnt find place")
                db.close();
                return res(null, null );
            }
            //db.close();
            });
    });
}



exports.create = function(document, res){
    let place = new Place(document.geometry
        ,document.icon
        ,document.id
        ,document.name
        ,document.opening_hours
        ,document.photos
        ,document.place_id
        ,document.price_level
        ,document.rating
        ,document.reference
        ,document.scope
        ,document.types
        ,document.vicinity
        ,document.going
        );

    if(place.place_id != true ){
        res( new Error("place id not included"));
    }

    findByPlaceId(place.place_id, function(err, placeFound){
        if(placeFound){
             res( new Error("place already exists"));
        }else{
            var db = mongo.connect(mongoUrl);
            mongo.connect(mongoUrl, function(err, db){
                if(err){console.error(err)};
                var collection = db.collection( collectionName );
                collection.insertOne(place, function(err){
                    if(err){console.error(err)}
                    collection.findOne(place,
                    {},
                    function(err, place){
                        if(err){console.error(err)};
                        res(null, place);
                        db.close();
                    });
                });
            });
        }
    })
}
