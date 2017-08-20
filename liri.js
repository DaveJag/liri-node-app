//Dave Jagodowski HW08
// liri.js

//provide access to data key info
var dataKeys = require("./keys.js");

var fs = require("fs");
var request = require("request");

// load required npm client libraries
var twitter = require("twitter");
var Spotify = require('node-spotify-api');


//collect node input
var action = process.argv[2];
var title = process.argv[3]; 

fs.readFile("keys.js", "utf8", function(error, data) {
    //log an error to the console if file cannot be read
	  if (error) {
		    return console.log(error);
	  }//end if
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
              break;

            case "do-what-it-says":
              //read command from randome.txt file
              justDoIt();
              break;

            default:
              console.log("Sorry, I do not understand that command. I can accept the following:");
              console.log("my-tweets");
              console.log("spotify-this-song \"song name\"");
              console.log("movie-this \"movie name\"");
              console.log("do-what-it-says");
              break;
        } // end switch/case
	  } // end Else
}) // end function fs.readfile


//Action Functions

function justDoIt() { //Reads from random.txt and processes the spotify command it contains
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        } //end if
        console.log(data);
        // split contents by commas and store in an array 
        var dataArr = data.split(",");
        //prep data and send to Spotify
        title = dataArr[1];
        var params = ("\"" + title + "\"");
        getSongInfo(params);
        }); //end fs.readFile
} // end function



function omdbData(title) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + title + '&apikey=40e9cece';
    request(omdbURL, function(error, response, body) {
        if (title === "" || title === null || title === undefined) {
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        } //end if 
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
            log(body); // calling log function

            //log formatted data to log.txt
            log("\r\n" + "Movie Search Results: " + "\r\n" +
            "Title: " + body.Title + "\r\n" + 
            "Release Year: " + body.Year + "\r\n" +
            "IMdB Rating: " + body.imdbRating + "\r\n" +
            "Country: " + body.Country + "\r\n" +
            "Language: " + body.Language + "\r\n" +
            "Plot: " + body.Plot + "\r\n" +
            "Actors: " + body.Actors + "\r\n" + 
            "Rotten Tomatoes Rating: " + body.tomatoRating + "\r\n" +
            "Rotten Tomatoes URL: " + body.tomatoURL + "\r\n" + "\r\n" );
        } //end else if
        else {
            console.log('Error');
        } //end else
    }); // end omdb request
} //end function



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
                    console.log("************************* " + "- result " + (i+1) + " -"  + " *************************");
                    console.log("Artist: " + songInfo[i].artists[0].name);
                    console.log("Song: " + songInfo[i].name);
                    console.log("Album name: " + songInfo[i].album.name);
                    console.log("Preview Url: " + songInfo[i].preview_url);  

                    //write data to log file
                    log("\r\n" + "************************* " + "- result " + (i+1) + "-"  + " *************************" + "\r\n" +
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album name: " + songInfo[i].album.name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\rn" ); 
                } //end if
            } //end for
        } //end if 
        else {
            console.log("Error: " + err);
            return;
        }
    }) //end function spotify.search
}// end function




function listTweets() {
    var action = process.argv[2];
	  var client = new twitter(dataKeys.twitterKeys);	
    var tweetData = [];
    //Get my own tweets (up to 20)
    var params = {user_id: "897120956329713666", count: 20};
  	
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          for (var i=0; i<tweets.length; i++) {
          tweetData.push({
      	      "Received: ": tweets[i].created_at,
              "Tweet: ": tweets[i].text
          }) //end push
          log(tweets[i].created_at + "  " + tweets[i].text + "\r\n");
          } // end for
          console.log(tweetData);
        } // end if
    });// end client.get
} //end function



// write everything that returns to terminal to the log.txt file
function log(logResults) {
    fs.appendFile("log.txt", logResults, (error) => {
        if(error) {
            throw error;
        } //end if
    }); //end fs.appendFile
}