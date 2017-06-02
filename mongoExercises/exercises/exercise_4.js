module.exports = function (db) {
    // Which month had the most checkouts overall?

    console.log("Exercise 4:\n\tMonth X had the most checkouts: Y");


    db.collection("checkouts").aggregate([
        {
            //Groups documents by month
            $group: {
                _id: "$month",
                //For each document in a grouping, add 1 to the count, effectively counting the number of documents
                count: { $sum: 1 },
            }
        },
        //tried getting max month here, it gets the max value, but had trouble getting the month to display with it
        //{
        //    $group: {
        //        _id:"$month",
        //        maxMonth: { $max: "$count" }
        //    }
        //}
        ////sorts in descending order
        { $sort: { count: -1 } },
    ], function (err, data) {
        if (err) {
            console.log(err);
        } else {
            displayResults(data);
        };
    });


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

    function getMonthsArray(results) {
        var months = [];
        for (var result of results) {
            months.push(result._id);
        }
        return months;
    }

    function displayResults(data) {
        var maxResults = lookForTies(data);
        var maxMonths = getMonthsArray(maxResults);
        var maxCount = maxResults[0].count;
        console.log(`Exercise 4:\n\tMonth ${maxMonths} had the most checkouts: ${maxCount}`);
    }


};
