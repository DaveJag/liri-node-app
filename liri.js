//Dave Jagodowski HW08
// liri.js

//provide access to data key info
var dataKeys = require("./keys.js");

//npm packages
// load the fs package to read and write
var fs = require("fs");

var request = require("request");

// load required npm client libraries
var twitter = require("twitter");
var Spotify = require('node-spotify-api');


//collect and analyze input
var action = process.argv[2];
var title = process.argv[3]; 

fs.readFile("keys.js", "utf8", function(error, data) {
	//log an error to the console if file cannot be read
	if (error) {
		return console.log(error);
	}
	else {
  
    switch(action) {
	    case "my-tweets":
	      listTweets();
	      break;

	    case "spotify-this-song":
	      //Search spotify for the title
        spotifyThisSong(title, data);
        break;

      case "movie-this":
        //search IMDB for this title
        omdbData(title);

    } // end Case
	} // end Else
}) // end function




//functions

function omdbData(title) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + title + '&apikey=40e9cece';
    request(omdbURL, function(error, response, body) {
        if (title === "" || title === null || title === undefined) {
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
        else if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);
        } else {
            console.log('Error');
        }
    });
}





//-------------------------------------------------------------------------------------------
function spotifyThisSong(title, data) {
    //If song not found, return "The Sign" by "Ace of Base"
    if (title === "" || title === null || title === undefined) {
      params = "track:The%20Sign%20artist:Ace%20of%20Base%20";
      getSongInfo(params);
    } //end if
    else 
      params = ("\"" + title + "\""); // return tracks containing exact query string only.
      getSongInfo(params);
 } //end function spotifyThisSong()


function getSongInfo(params){
     var spotify = new Spotify({
      id: '5f651205a9ba44adbe8f6e9a2a147759',
      secret: 'bddcf4cdf328487aa6c3e88209654154'
     });
    spotify.search({type: "track", query: params}, function(err, data) {
        if(!err) {
            //console.log(data);
            var songInfo = data.tracks.items;
            for (var i=0; i<data.tracks.items.length; i++){
                if (songInfo[i] != undefined) {
                    var spotifyResults = 
                     "************************* " + "- result " + (i+1) + "-"  + " *************************" + "\n" +
                        "Artist: " + songInfo[i].artists[0].name + "\n" +
                        "Song: " + songInfo[i].name + "\n" +
                        "Album name: " + songInfo[i].album.name + "\n" +
                        "Preview Url: " + songInfo[i].preview_url + "\n";
                       //print results
                        console.log(spotifyResults);
                } //end if not undefined
            } //end for
        } //end if not err
            else {
                console.log("Error: " + err);
                return;
            }
    }) //end function spotify.search

}

//------------------------------------------------------------------------------------

function listTweets() {
  var action = process.argv[2];
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