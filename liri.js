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
	console.log("listTweets-01");
	var client = new twitter(dataKeys.twitterKeys);	
	console.log("listTweets-02");
    var params = {screen_name: "David_Walter", count: 10};
    console.log("listTweets-03");
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
    console.log(tweets);
    }
  });
  }