module.exports = function(db) {
	// How many users are there?

	db.collection("checkouts").distinct('userId', function(err, data) {
		console.log("Example:\n\tThere are " + data.length + " users");
	})

};
