'use strict'

var config  = require("./../../config/config");

// mongo
var mongo               = require("mongodb").MongoClient;
var mongoPort           = config.mongoPort;
var mongoDatabase       = config.mongoDatabase;
var collectionName      = "guestLists";
var mongoUrl            =  `mongodb://localhost:${mongoPort}/${mongoDatabase}`;


class GuestList {
    constructor(
        place_id,
        guests
    ){
        this.place_id   = place_id;
        this.guests     = [guests] || [];
    }
}




var getByPlaceId = function (place_id, res){
    //console.log("Get by PlaceId called");
    var query = {place_id : place_id };
    //console.log(place_id)
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);
        var results = collection.findOne({"guestList.place_id": place_id},
        { _id: 0},
        function(err, result){
        //collection.find({}).toArray(function (err, results){
            if(err){console.error(err)};
            if (result){
                //console.log(result);
                //console.log("found user")
                db.close();
                return res(null, result);
            }else{
                //console.log("didnt find place_id")
                db.close();
                return res(null, null );
            }
            //db.close();
        });
    });
}
exports.getByPlaceId = getByPlaceId;



exports.set = function set(guestList, res){
    console.log(guestList);

    if(guestList.place_id != true ){
        res( new Error("place_id not included"));
    }
    getByPlaceId(guestList.place_id, function(err, placeFound){
        if(placeFound){
            //res( new Error("place already exists"));
            console.log("place already exists");
        }
    })

    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection( collectionName );
        collection.update({"guestList.place_id": guestList.place_id}, 
        {$set:{"guestList": guestList} },
        {upsert: true}
        , function(err, updatedDoc){
            //if(err){console.error(err)}
            if(updatedDoc){
                //console.log(updatedDoc.result)
                db.close();
            }else{
                "no updatedDoc"
                db.close();
            }
        }
    );
});

}
