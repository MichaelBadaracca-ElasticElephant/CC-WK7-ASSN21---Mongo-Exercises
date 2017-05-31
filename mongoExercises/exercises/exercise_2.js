module.exports = function (db) {
    console.log("EXERCISE 2")
    // Which users checked out any of the Lord of the Rings trilogy?

    //Used this site as a reference: https://www.sitepoint.com/using-joins-in-mongodb-nosql-databases/

    //get lord of the rings ids then use them to look up users


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

    var nextPromise = getMoviesPromise.then(function (movies) {
        getCheckoutsFromMovies(movies);
    })

    function getCheckoutsFromMovies(movies) {
        var movieIds = getMovieIdsAndConvertToString(movies);
        db.collection("checkouts").find(
            {movieId: { $in: movieIds }}
        ).toArray(function (err, checkouts) {

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

    function getMovieIdsAndConvertToString(movies) {
        var movieIds = [];
        for (movie of movies) {
            movieIds.push(movie.movieId.toString());
        }
        return movieIds;
    }
};
