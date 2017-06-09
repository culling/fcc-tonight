var config  = require("./../../config/config");

// mongo
var mongo               = require("mongodb").MongoClient;
var mongoPort           = config.mongoPort;
var mongoDatabase       = config.mongoDatabase;
var collectionName      = "users";
var mongoUrl            =  `mongodb://localhost:${mongoPort}/${mongoDatabase}`;


exports.findById = function(id, res){
    //console.log("Find by Id called");
    var query = { _id : id };
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);
        var results = collection.findOne({_id: id},{}, function(err, result){
            if(err){console.error(err)};
            if (result){
                db.close();
                res(null, JSON.stringify(result) );
            }else{
                db.close();
                res(new Error('User ' + id + ' does not exist'));
            }

        });
    });
}




var findByUsername = function(username, res){
    //console.log("Find by Username called");
    var query = {username : username };
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);
        var results = collection.findOne({username: username},{}, function(err, result){
        //collection.find({}).toArray(function (err, results){
            if(err){console.error(err)};
            if (result){

                db.close();
                return res(null, result );
            }else{
                //console.log("didnt find user")
                db.close();
                return res(null, null );
            }
            //db.close();
            });
    });
}

exports.findByUsername = findByUsername;


exports.create = function(document, res){

    findByUsername(document.username, function(err, userFound){
        if(userFound){
             res( new Error("username already exists"));
        }else{
            var db = mongo.connect(mongoUrl);
            mongo.connect(mongoUrl, function(err, db){
                if(err){console.error(err)};
                var collection = db.collection( collectionName );
                collection.insertOne(document, function(err){
                    if(err){console.error(err)}
                    collection.findOne(document,
                    {},
                    function(err, document){
                        if(err){console.error(err)};
                        res(null, document);
                        db.close();
                    });
                });
            });

        }
    })
}

exports.set = function set(user, res){
    var defaultLocation = user.defaultLocation;
    //console.log("user");
    //console.log(user);
    if(user.hasOwnProperty("_id") != true ){
        res( ("not a user"));
        return;
    }
    if(user.defaultLocation == "My Search Location"){
        res( ("empty string found"));
        return;
    }

    if(user.defaultLocation == undefined){
        res( ("empty string found"));
        return;
    }

    delete user._id;


    findByUsername(user.username, function(err, userFound){
        if(userFound){
            //console.log("user exists");


            var db = mongo.connect(mongoUrl);
            mongo.connect(mongoUrl, function(err, db){
                if(err){console.error(err)};
                var collection = db.collection( collectionName );
                collection.update({"username": user.username}, 
                {$set:{"defaultLocation": user.defaultLocation}},
                {upsert: false}
                , function(err, updatedDoc){
                    if(err){console.error(err)}
                    if(updatedDoc){
                        //console.log(updatedDoc.result )
                        db.close();
                    }else{
                        "no updatedDoc"
                        db.close();
                    }
                }
            );
        });
    }
})
}

