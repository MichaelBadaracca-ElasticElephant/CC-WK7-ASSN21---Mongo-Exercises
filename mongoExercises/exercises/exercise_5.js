module.exports = function (db) {
    // Which movie(s) had the most checkouts in April?

    //GLOBAL VARS
    var maxResults = []
    var mostCheckouts = 0;

    db.collection("checkouts").aggregate([
        {
            $match: { month: "apr" }
        },
        {
            $group: {
                _id: "$movieId",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ], function (err, data) {
        if (err) { console.log(err); }
        else {
            analyzeResults(data);
        }
    })
    
    function lookForTies(descendingResults) {
        //This function is expecting a sorted array in descending order and is simply looking for the number of ties
        //set the max to the first element (highest) of the sorted array
        //add elements if they have the same value of the max - ie a tie, otherwise break
        var maxCount = descendingResults[0].count;
        var maxResults = [];

        for (result of descendingResults) {
            if (result.count === maxCount) {
                maxResults.push(result);
            }
            //when there is not longer a tie for first, break
            else {
                break;
            }
        }
        return maxResults;
    }

    //Extracs the movie Id from a movie and converts it to a string so it can be looked up in the checkouts collection
    function getMovieIdsAsNums(movieIdsAsStrings) {
        var movieIdsAsNums = [];
        for (movieIdAsString of movieIdsAsStrings) {
            movieIdsAsNums.push(parseInt(movieIdAsString));
        }
        return movieIdsAsNums;
    }

    function getMovieIdsFromData(movieData) {
        var movieIds = [];
        for (item of movieData) {
            movieIds.push(item._id);
        }
        return movieIds;
    }

    function lookupMovieTitlesByIdAndDisplayResults(movieIds) {
        db.collection("movies").aggregate([
            { $match: { movieId: { $in: movieIds } } },
            { $group: {_id:"$title"}}
        ], function (err, data) {
            if (err) { console.log(err) }
            else {
                //QUESTION:How to group, but strip the id property and just keep the value?
                //Get just purse titles without property name
                var movieTitles = [];
                for (movieTitle of data) {
                    movieTitles.push(movieTitle._id);
                }
                //I don't like displaying results from here, but with async behavior it is what worked
                //TODO: find a cleaner way to write this code
                console.log(`Exercise 5:\n\tMovies ${movieTitles} had the most checkouts in April: ${mostCheckouts}`);
            }
        });
    }
 
    function getMovieTitlesAndDisplayResults(movieData) {
        //Movie ids need to be converted to numbers to be looked up in the movies collection
        var stringMovieIds = getMovieIdsFromData(movieData);
        var numMovieIds = getMovieIdsAsNums(stringMovieIds);
        lookupMovieTitlesByIdAndDisplayResults(numMovieIds)
    }

    function analyzeResults(data) {
        maxResults = lookForTies(data);
        //since each max result should have the same count, take it from any element
        mostCheckouts = maxResults[0].count;
        getMovieTitlesAndDisplayResults(maxResults);
    }
};
