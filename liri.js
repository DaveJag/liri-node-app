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
var songName = process.argv[3]; 

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
        spotifyThisSong(songName, data);
        break;

    } // end Case

	} // end Else
}) // end function




//functions

function spotifyThisSong(songName, data) {
    
    var spotify = new Spotify({
      id: '5f651205a9ba44adbe8f6e9a2a147759',
      secret: 'bddcf4cdf328487aa6c3e88209654154'
     });
   // var songName = process.argv[3];
    //If song not found, return "The Sign" by "Ace of Base"
    if (songName === undefined) {
        songName = "The Sign"; //by artist "Ace of Base";
    } //end if
    params = songName;
    //search api for type = track, query = songName
    spotify.search({type: "track", query: params}, function(err, data) {
        if(!err) {
            //console.log(data);
            var songInfo = data.tracks.items;
            for (var i=0; i<data.tracks.items.length; i++){
                if (songInfo[i] != undefined) {
                    var spotifyResults = 
                     "************************* " + "-" + (i+1) + "-"  + " *************************" + "\r\n" +
                        "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                        "Song: " + songInfo[i].name + "\r\n" +
                        "Album name: " + songInfo[i].album.name + "\r\n" +
                        "Preview Url: " + songInfo[i].preview_url + "\r\n";
                       
                        console.log(spotifyResults);
                } //end if not undefined
            } //end for
        } //end if not err
            else {
                console.log("Error: " + err);
                return;
            }
    }) //end function spotify.search
 } //end function spotifyThisSong()


/* Edna's Solution 
function findSong(songName){  //on Spotify
  //If song not found, return "The Sign" by "Ace of Base"
  if (songName === undefined) {
    songName = "The Sign";
    artistName = "Ace of Base";
  } //end if

  spotify.search({ type: 'track', query: 'songName'}, function(err, data) {
  if (err) {
      console.log('Houston, we have a problem! ' + err);
      return;
  }; // end if 

  var songs = data.tracks.items;
  var data = []; //an array to hold data

  for (var i = 0; i < songs.length; i++) {
    data.push({
      "artist: ": songs[i].artists.map(getArtistNames),
      "song name: ": songs[i].name,
      "preview song: ": songs[i].preview_url,
      "album name: ": songs[i].album.name
    }) // end data push
  } //end for loop
    console.log(data);
  })//end spotify function
} // end function findSong

*/

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