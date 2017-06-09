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
var places      = require("./../controllers/places.controller.server");






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



router.put("/guestList", function(req, res){

    var guestList = {
        place_id:   req.body.place_id,
        guests:     req.body.guests
    };
    mongoExport.guestList.set(guestList, function(res){

    });
});

router.get("/guestList/:id", function(req, res){

    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    Date.prototype.shortDate = function() {
    return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate())
    };

    mongoExport.guestList.getByPlaceId(req.params.id, function(err, rawResults){
        if(err){
            res.write(err);
        }


        if (rawResults){
            var results = rawResults;
            results.guestList.guests = rawResults.guestList.guests.filter((guest) => {
                var currentDate = new Date().shortDate();
                return guest.date == currentDate;
            });
        }else{
            results = rawResults;
        }
        

        res.write(JSON.stringify(results));

        res.end();

    });

});


/*
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
*/

    //User
    router.get("/user", function(req, res){
        var user = req.user;
        if(user){
        user.type = "user";
        delete user.password;
        }else{
            user = {
                username: req.ip,
                type:   "ip"
            }
        }
        res.send(user);
    });





module.exports = router;