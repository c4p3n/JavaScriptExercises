// Daily Programmer Subreddit
// https://www.reddit.com/r/dailyprogrammer/comments/4uhqdb/20160725_challenge_277_easy_simplifying_fractions/

// Given a list of two numbers separated by a space, with the first being the numerator and the second being
// the denominator, reduce the "fraction" as much as possible.
// Handles only Integers > 0.

const fs = require('fs');
const inputFile = "input.txt";
const outputFile = "output.txt";
let rawData = "";
let numAndDenom = [];
let fractions = [];
let reducedFractions = [];
let outputString = "";

console.log("Reading file...");

fs.readFile(inputFile, function (err, data) {
	if (err) {
		return console.error(err);
	}

	rawData = data.toString();
	// console.log(rawData);

	// Split number String into Array with empty string between each fraction.
	rawData = rawData.split(/\s/);
	// console.log(rawData);

	// Create 2-dim Array with each element in outer array as one fraction, using empty string as delimiter.
	for (let i = 0; i < rawData.length; i++) {
		if (rawData[i] !== '') {
			numAndDenom.push(rawData[i]);
		} else {
			fractions.push(numAndDenom);
			numAndDenom = [];
		}

	}
	// Push the last fraction into the array
	fractions.push(numAndDenom);
	numAndDenom = [];
	
	// console.log(fractions);

	// Reduce fractions
	let numerator = 0;
	let denominator = 0;

	function findGCD(largeNum, smallNum) {
		let divisor = largeNum;
		let isGCD = false;
		let reducedNumAndDenom = [];

		do {
			isGCD = (largeNum % divisor) === 0 && (smallNum % divisor) === 0;
			// If the divisor is the GCD, do not decrement. This will throw off the smallest number calculations.
			if(!isGCD) {
				divisor--;
			}
		} while (!isGCD);

		// console.log("GCD is: " + divisor);
		reducedNumAndDenom.push(numerator / divisor);
		reducedNumAndDenom.push(denominator / divisor);
		// console.log(reducedNumAndDenom);
		return reducedNumAndDenom;
	}

	// Reduce all fractions
	for (i = 0; i < fractions.length; i++) {
		numerator = Number(fractions[i][0]);
		denominator = Number(fractions [i][1]);

		if (denominator > numerator) {
			reducedFractions.push(findGCD(denominator, numerator));
		} else reducedFractions.push(findGCD(numerator, denominator));

	}

	// console.log(reducedFractions);

	// Output to file
	for (i = 0; i < reducedFractions.length; i++) {
		outputString += reducedFractions[i][0] + " " + reducedFractions[i][1] + "\n";
	}

	fs.writeFile(outputFile, outputString, function(err) {
		if (err) {
			console.error(err);
		}
	});
});



