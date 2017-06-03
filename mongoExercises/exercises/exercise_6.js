module.exports = function(db) {
	// What user(s) had the most checkouts?

    //group checkouts by user
    db.collection("checkouts").aggregate([
        {
            $group: {
                _id: "$userId",
                count:{$sum:1}
            }
        },
        {
            $sort:{count:-1}
        }
    ], function (err, data) {
        if (err) { console.log(err) }
        else {analyzeAndDisplayResults(data);}
    });

    function analyzeAndDisplayResults(data) {
        var userDataWithMaxCheckouts = lookForTies(data);
        var userIds = getUserIdsFromRawData(userDataWithMaxCheckouts);
        var maxCheckouts = userDataWithMaxCheckouts[0].count;
        console.log(`Exercise 6:\n\tUser(s) ${userIds} had the most checkouts: ${maxCheckouts}`);
    }

    function getUserIdsFromRawData(rawData) {
        var users = [];
        for (data of rawData) {
            users.push(data._id);
        }
        return users;
    }

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

};
