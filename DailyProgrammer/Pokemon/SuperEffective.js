 /** Daily Programmer Subreddit
https://www.reddit.com/r/dailyprogrammer/comments/5961a5/20161024_challenge_289_easy_its_super_effective/

The program should take the type of a move being used and the types of the Pokémon it is being used on.
The program should output the damage multiplier these types lead to.
**/

// Adapted from David Walsh's blog post: https://davidwalsh.name/nodejs-http-request
// and NodeJS docs: https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_get_options_callback
"use strict";

const http = require('http');
const readline = require('readline');
const regEx = /^[a-z]+\s->\s[a-z]+$/;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});


console.log("Welcome to Super Effective!");
console.log("Please enter a type matchup in format \"<attacking type> -> <defending type>\"");
rl.prompt();
rl.on('line', function(input) {
	
	let found = input.match(regEx);
	if (found !== null) {
		let types = found[0].split(' -> ');
		getPokemonData(types[0], types[1]);
	}
	rl.prompt();
});

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
			body += d;
		});
		
		response.on('end', function() {
			let dmgArr = [];
			const parsed = JSON.parse(body);
			/** 
			* Create a 2d array where each of the three inner arrays
			* corresponds to a damage multiplier.
			* If a type is not in one of the three inner arrays, it can
			* be assumed that the given type does normal damage to the type
			* it used against.
			**/
			dmgArr.push(parsed.damage_relations.no_damage_to);
			dmgArr.push(parsed.damage_relations.half_damage_to);
			dmgArr.push(parsed.damage_relations.double_damage_to);
			console.log(calculateDmg(dmgArr, typeUsedAgainst) + "x");
		});
	});
}

function calculateDmg(damageArray, typeUsedAgainst) {
	// search the 2d array for the type the move is being used against
	// when found return the inner array in which the type was found
	function findTypeUsedAgainst() {
		for (let i = 0; i < damageArray.length; i++) {
			for (let j = 0; j < damageArray[i].length; j++) {
				if (damageArray[i][j].name === typeUsedAgainst) {
					return i;
				}
			}
		}
	}

	let arrFoundIn = findTypeUsedAgainst();
	
	/** 
	* Using the index of the inner array where the type was found
	* we can determine how much damage will be done against that type.
	* first array:  no damage
	* second array: half damage
	* third array:  double damage
	* not found:    normal damage
	**/
	if (arrFoundIn === 0) {
		return 0;
	} else if (arrFoundIn == 1) {
		return 0.5;
	} else if (arrFoundIn == 2) {
		return 2;
	} else return 1;
} 