module.exports = function(db) {
	// How many movies are there?

    //ANOTHER WAY OF COUNTING
    //db.collection("movies").distinct('movieId', function (err, data) {
    //    console.log(`Exercise 1:\n\tThere are ${data.length} movies`);
    //})


    //AGGREGATE METHOD OF COUNTING
    db.collection("movies").count({
        //Blank query returns all documents
    }, function (err, numMovies) {
        console.log(`Exercise 1:\n\tThere are ${numMovies} movies`);
    });

};
