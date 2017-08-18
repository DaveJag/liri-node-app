//Dave Jagodowski HW08
// liri.js

//provide access to data key info
var dataKeys = require("./keys.js");

//npm packages
// load the fs package to read and write
var fs = require("fs");

var request = require("request");

// load twitter-node-sdk client library
var twitter = require("twitter");


//collect and analyze input
var action = process.argv[2];

fs.readFile("keys.js", "utf8", function(error, data) {
	//log an error to the console if file cannot be read
	if (error) {
		console.log("line 23");
		return console.log(error);
	}
	else {
  
    switch(action) {
	    case "my-tweets":
	      listTweets();
	      break;
    } // end Case

	} // end Else
}) // end function




//functions
function listTweets() {
	var client = new twitter(dataKeys.twitterKeys);	
    //Get my own tweets (up to 20)
     var params = {user_id: "897120956329713666", count: 20};
  	client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

    var tweetData =[];
    for (var i=0; i<tweets.length; i++) {
      tweetData.push({
      	"Received: ": tweets[i].created_at,
        "Tweet: ": tweets[i].text
      }) //end push
    } // end for
    console.log(tweetData);

    } // end if
  });// end client.get
  } //end function