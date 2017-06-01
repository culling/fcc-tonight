const url           = require("url");
const querystring   = require('querystring');

//Express and set up router
var express         = require('express');
var router          = express.Router();

//Configs and Modules
var config      = require("./../../config/config");
var mongoExport = require("./../../config/mongo");


var passport    = require("passport");
var users       = require("./../controllers/user.controller.server");
//var polls       = require("./../controllers/polls.controller.server");
var places      = require("./../controllers/places.controller.server");


//Happy Helpful functions
function listAllProperties(o) {
    var objectToInspect;     
    var result = [];
    for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
    result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
    }
    return result; 
}



router.get("/", function(req, res){
    res.sendFile(("apiguide.html"), {root: "public"});
});


router.get("/places/:id", function(req, res){
    places.getPlacesNearAddress(req.params.id, "bar", function(placesResult){
        var places = placesResult.json.results;
        res.write(JSON.stringify(places, null, "\t"));
        res.end();        
    });
});



router.post("/going/new", function(req, res){
    console.log(req.body);
    //var props = listAllProperties(req.body);
    //console.log(props);
    //var place = JSON.parse(props[0]);

    //console.log(place);
    var place = req.body;
    mongoExport.places.create(places, function(res){
        //console.log(res);
    });

});


//Messages
router.get("/message", function(req, res){
    console.log("called - get");

});
router.post("/message", function(req, res){
    console.log("called - post");

});
router.put("/message", function(req, res){
    console.log("called - put");

});

/*
    //Meetings
    router.get("/meetings", function(req, res){
        mongoExport.polls.retrieveMeetings(null, function(foundDocs){
            res.send(foundDocs);
        })
    });


    // Polls

    router.get("/polls", function(req, res){
        //var username = req.user.username ;

        mongoExport.polls.retrieve(null, function(foundDocs){

            res.send(foundDocs);
        })
    });



    router.get("/polls/user", function(req, res){
        //var username = req.user.username ;
        mongoExport.polls.retrieve(null, function(foundDocs){

            if(req.user){
                var foundDocs = foundDocs.filter((foundDoc) => {
                    //console.log(foundDoc);
                    return foundDoc.createdByUser == req.user.username;
                });
                //console.log(filtered);
            }

            res.send(foundDocs);
        })
    });

    router.post("/polls/new", function(req, res){
        function listAllProperties(o) {
            var objectToInspect;     
            var result = [];
            
            for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
            result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
            }
        
            return result; 
        }

        var props =  listAllProperties(req.body);
        //console.log(props);
        
        var poll = JSON.parse(props[0] );

        console.log(req.user);
        poll.createdByUser = req.user.username;
        //console.log(req.body);
        mongoExport.polls.create(poll, function(res){
            
        } );
    });

    router.post("/polls/update", function(req, res){
        function listAllProperties(o) {
            var objectToInspect;     
            var result = [];
            
            for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
            result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
            }
        
            return result; 
        }

        var props =  listAllProperties(req.body);
        var poll = JSON.parse(props[0] ).poll;
        //console.log(poll);
        mongoExport.polls.update(poll, function(res){
            console.log(res);
        });
    });


    //DELETE
    router.delete("/polls/delete/:id", function(req, res){
        function listAllProperties(o) {
            var objectToInspect;     
            var result = [];
            
            for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
            result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
            }
        
            return result; 
        }


        var props =  listAllProperties(req.body);
        var poll = JSON.parse(props[0] ).poll;

        console.log(poll);

        mongoExport.polls.delete(poll, function(res){
            console.log(res);
        });

    });


    router.get("/polls/:id", function(req, res){

        console.log(req.params.id);

        mongoExport.polls.retrieve(null, function(foundDocs){
            
            if(req.params.id){
                var foundDocs = foundDocs.filter((foundDoc) => {
                    //console.log(foundDoc);
                    return foundDoc.id == req.params.id ;
                });
                //console.log(filtered);
            }

            res.send(foundDocs);
        })
    });




    //User
    router.get("/user", function(req, res){
        var user = req.user;
        if(! user){
            user = {
                username: req.ip
            }
        }
        res.send(user);
    })



*/

module.exports = router;