module.exports = function (db) {

    // Which users checked out any of the Lord of the Rings trilogy?

    //Used this site as a reference: https://www.sitepoint.com/using-joins-in-mongodb-nosql-databases/

    //Gets movies with a title like "Lord of the Rings"
    var getMoviesPromise = new Promise(function (resolve, reject) {
        db.collection("movies").find(
            {
                title: {
                    $regex: /Lord of the Rings.+/
                }
            }
        ).toArray(function (err, movies) {
            resolve(movies);
        })
    });

    //Once the movies are found, checkouts with those movies can be evaluated
    var nextPromise = getMoviesPromise.then(function (movies) {
        getCheckoutsFromMovies(movies);
    })

    //Gets the checkouts corresponding to the movie ids passed in
    function getCheckoutsFromMovies(movies) {
        var movieIds = getMovieIdsAndConvertToString(movies);
        db.collection("checkouts").find(
            {movieId: { $in: movieIds }}
        ).toArray(function (err, checkouts) {
            //Extracts and orders unique users from checkouts
            var users = getDistinctUsersFromCheckouts(checkouts);
            console.log("Exercise 2:\n\tThe LOTR movies were checked out by users " + users);
        });
    }

    function getDistinctUsersFromCheckouts(checkouts) {

        //loop through each checkout and add userId as a key of an object if it doesn't already exist'
        //This allows us to easily check if the key exits
        var unique = {};

        for (checkout of checkouts) {
            if (!unique[checkout.userId]) {
                unique[checkout.userId]=true;
            }
        }
        //get the keys of the object back as an array

        return Object.keys(unique);
    }

    //Extracs the movie Id from a movie and converts it to a string so it can be looked up in the checkouts collection
    function getMovieIdsAndConvertToString(movies) {
        var movieIds = [];
        for (movie of movies) {
            movieIds.push(movie.movieId.toString());
        }
        return movieIds;
    }
};
