/** Daily Programmer Subreddit
https://www.reddit.com/r/dailyprogrammer/comments/5961a5/20161024_challenge_289_easy_its_super_effective/

The program should take the type of a move being used and the types of the Pokémon it is being used on.
The program should output the damage multiplier these types lead to.
**/

// Adapted from David Walsh's blog post: https://davidwalsh.name/nodejs-http-request
// and NodeJS docs: https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_get_options_callback
const http = require('http');
console.log("Starting...");

function getPokemonData() {

	http.get('http://pokeapi.co/api/v2/type/fire/', function(response) {
		const statusCode = response.statusCode;
  		const contentType = response.headers['content-type'];

		let error;
  		if (statusCode !== 200) {
    	error = new Error(`Request Failed.\n` + `Status Code: ${statusCode}`);
  		} else if (!/^application\/json/.test(contentType)) {
    	error = new Error(`Invalid content-type.\n` + `Expected application/json but received ${contentType}`);
  		}
  		if (error) {
    		console.log(error.message);
    		// consume response data to free up memory
    		response.resume();
    		return;
  		}

		response.setEncoding('utf8');
		
		let body = '';
		response.on('data', function(d) {
			console.log("fetching response");
			body += d;
		});
		
		response.on('end', function() {
			console.log("printing response");
			console.log(body);
		});
	});
}

getPokemonData();