 /** Daily Programmer Subreddit
https://www.reddit.com/r/dailyprogrammer/comments/5961a5/20161024_challenge_289_easy_its_super_effective/

The program should take the type of a move being used and the types of the Pokémon it is being used on.
The program should output the damage multiplier these types lead to.
**/

// Adapted from David Walsh's blog post: https://davidwalsh.name/nodejs-http-request
// and NodeJS docs: https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_get_options_callback
"use strict";

const http = require('http');
//const fs = require('fs');
console.log("Starting...");

function getPokemonData(typeUsed, typeUsedAgainst) {
	const url = 'http://pokeapi.co/api/v2/type/' + typeUsed + '/'; 

	http.get(url, function(response) {
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
			let dmgArr = [];
			console.log("printing response");
			// Output to file for testing. 
			// TODO: Delete later.
			/**fs.writeFile('output.json', body, function(err) {
				if (err) {
					console.error(err);
				}
			});**/
			const parsed = JSON.parse(body);
			dmgArr.push(parsed.damage_relations.no_damage_to);
			dmgArr.push(parsed.damage_relations.half_damage_to);
			dmgArr.push(parsed.damage_relations.double_damage_to);
			calculateDmg(dmgArr, typeUsedAgainst);
		});
	});
}

function calculateDmg(damageArray, typeUsedAgainst) {
	console.log(damageArray);
	console.log("Used against: " + typeUsedAgainst);
}

getPokemonData('fire', 'grass');

 