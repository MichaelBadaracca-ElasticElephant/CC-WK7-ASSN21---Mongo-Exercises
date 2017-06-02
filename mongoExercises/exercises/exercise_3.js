module.exports = function (db) {
    //What is the title of the movie(s) that was the most checked out?


    //Used the follwing resource: https://stackoverflow.com/questions/9491920/find-all-duplicate-documents-in-a-mongodb-collection-by-a-key-field
    //Modified the answer from the user "expert"

    db.collection("checkouts").aggregate([
        {
            $group: {
                _id: { movieId: "$movieId" },   // replace `name` here twice
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                count: { $gte: 2 }
            }
        },
        { $sort: { count: -1 } },
        //{ $limit: 10 }
    ], function (err, data) {
        if (err) {
            console.log(err);
        } else {
            parseResults(data);
        }

    }
    );


    function findTiesForFirstInSortedCheckouts(sortedCheckouts) {
        //This function is expecting a sorted array and is simply looking for the number of ties
        //set the max to the first element (highest) of the sorted array
        var maxCount = sortedCheckouts[0].count;
        var maxCountArray = [];

        for (sortedCheckout of sortedCheckouts) {
            if (sortedCheckout.count === maxCount) {
                maxCountArray.push(parseSortedCheckout(sortedCheckout))
            }
            //when there is not longer a tie for first, break
            else {
                break;
            }
        }

        return maxCountArray;
    }

    //take a sorted checkout (from aggregate) and make the data more accessible
    function parseSortedCheckout(sortedCheckout) {

        var formattedCheckout = {
            movieId: sortedCheckout._id.movieId,
            count: sortedCheckout.count
        }

        return formattedCheckout;
    }

    function parseResults(sortedCheckouts) {
        var moviesWithMostCheckouts = findTiesForFirstInSortedCheckouts(sortedCheckouts)
        getMovieNamesFromMovieId(moviesWithMostCheckouts);
    }

    function displayResults(movieTitles, numberOfCheckouts) {
        console.log(`Exercise 3:\n\tThe movie(s) ${movieTitles} -- checked out ${numberOfCheckouts} times`);
    }


    function getMovieNamesFromMovieId(sortedCheckouts) {
        
        var moviePromises = createTitleLookupPromises(sortedCheckouts);
        var numberOfCheckouts = sortedCheckouts[0].count;

        //once all the movie title lookups have been successful, extract the title from each 

        Promise.all(moviePromises).then(function (movies) {
            var movieTitles = [];
            
            for (movie of movies) {
                movieTitles.push(movie.title);
            }

            displayResults(movieTitles, numberOfCheckouts);
        })
    }

    function createTitleLookupPromises(sortedCheckouts) {
        var moviePromises = []

        for (sortedCheckout of sortedCheckouts) {
            //create a new promise for each db lookup of movie titles
            var movieIdAsNum = parseInt(sortedCheckout.movieId);

            var moviePromise = new Promise(function (resolve, reject) {
                db.collection("movies").findOne(
                    { movieId: movieIdAsNum },
                    function (err, movie) {
                        resolve(movie);
                    }
                )
            })
            moviePromises.push(moviePromise);
        }
        return moviePromises;
    }






};
