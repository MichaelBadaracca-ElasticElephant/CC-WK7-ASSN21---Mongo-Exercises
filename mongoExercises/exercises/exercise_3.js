module.exports = function(db) {
	//What is the title of the movie(s) that was the most checked out?
    //count up the number of checkouts with the same movieId

    db.collection("checkouts").find({
        //movieId:
    })

	console.log ("Exercise 3:\n\tThe movie(s) X, Y -- checked out Z times");
};
