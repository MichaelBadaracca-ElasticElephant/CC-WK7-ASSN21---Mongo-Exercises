






// Hey! Don't edit this file. Feel free to read it, though :)

// Run this file by executing `node import.js` (without backticks)

// Read instructions.txt for details on how to solve these problems.







var fs = require("fs");

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost", function(err, db) {
	if (err) {
		console.log(err.message);
		console.log("(Did you remember to start mongo?)");
		process.exit(1);
	}

	db.collection("movies").findOne({}, function(err, data) {
		if(data) {
			console.log("Import script has already run!");
			console.log("To re-run, delete and re-create the 'data' folder");
			db.close();
			process.exit(0);
			return;
		}
		importAll(db);
	});

});

var DATA_DIR = './.import';

//var CheckoutSchema = require('./Checkout.schema.js');
//var Checkout = mongoose.model("Checkout", CheckoutSchema);

//var MovieSchema = require('./Movie.schema.js');
//var Movie = mongoose.model("Movie", MovieSchema);

function importAll(db) {
	console.log("Beginning Import...");

	var moviesCollection = db.collection("movies");
	var checkoutCollection = db.collection("checkouts");

	var doneWithMovies = false;
	var doneWithCheckouts = false;
	function updateDone(name, count) {
		if (name == "Movies") {
			console.log(`Inserted ${count} movies.`);
			doneWithMovies = true;
		} else if (name == "Checkouts") {
			console.log(`Inserted ${count} checkouts.`);
			doneWithCheckouts = true;
		}
		if (doneWithMovies && doneWithCheckouts) {
			db.close();
			console.log("All done!");
			process.exit(0);
		}
	}

	var checkoutData = fs.readFile(DATA_DIR + "/checkouts.txt", function(err, data) {
		var checkouts;
		if (err) {
			console.log("Hey, make sure the hidden folder '.import' made it into the project folder.");
			return;
		}

		checkouts = data.toString().split("\n");

		checkouts = checkouts.map(function(line) {
			return line.split(" ");
		}).filter(function(line) {
			return line[0].length;
		}).map(function(line) {
			return {
				userId: line[0].substr(4),
				month: line[1],
				movieId: line[2]
			};
		});

		checkoutCollection.insertMany(
			checkouts,
			function(err, r) {
				if (err) {
					console.log("Error inserting checkouts");
					console.log(err);
				}
				updateDone("Checkouts", r.insertedCount);
			}
		);
	});

	var movieData = fs.readFile(DATA_DIR + '/movies.txt', function(err, data) {
		var movies;
		if (err) {
			console.log("Hey, make sure the hidden folder '.import' made it into the project folder.");
			return;
		}

		movies = data.toString().split("\n");

		movies = movies.map(function(line) {
			return line.split(" ");
		}).filter(function(line) {
			return (line[0].length && line[0][0] !== "#");
		}).map(function(line) {
			return {
				movieId: parseInt(line[0]),
				title: line.slice(1, -1).join(" "),
				year: parseInt(line[line.length - 1].slice(1,-1))
			};
		})

		moviesCollection.insertMany(
			movies,
			function(err, r) {
				if (err) {
					console.log("Error inserting movies");
					console.log(err);
				}
				updateDone("Movies", r.insertedCount);
			}
		);
	});
}
