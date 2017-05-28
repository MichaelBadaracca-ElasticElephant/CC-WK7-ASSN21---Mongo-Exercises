
// Edit the exercises in the exercises folder.
// Run this file to execute all three exercises at once.

// Set up connection to Mongo
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost", function(err, db) {
	if (err) {
		console.log("Error connecting to DB.");
		console.log("(Did you remember to start mongod?)");
		process.exit(0);
	}
	db.collection("movies").findOne({}, function(err, data) {
		if(err) {
			console.log("Error -- no data in database. Make sure you run");
			console.log("  node import.js  ");
			console.log("once before running exercises.js");
			db.close();
			process.exit(0);
		}
		runExercises(db);
	});
});

function runExercises(db) {
	console.log("Running exercises");
	console.log("The exercises may return in any order.")
	// Load Exercises
	var example = require('./exercises/example.js');
	var exercises = [];
	for (var i = 1; i <= 6; i++) {
		exercises.push(
			require('./exercises/exercise_' + i + '.js')
		);
	}

	// Run Exercises
	example(db);
	for (var ex of exercises) {
		ex(db);
	}
}
