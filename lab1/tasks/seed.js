const { ObjectID } = require("mongodb");
const dbConnection = require("../config/mongoConnection");
const dataMethods = require("../data/index");
const movieMethods = dataMethods.movies;
const commentsMethods = dataMethods.comments;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  // Complete thorough testing
  // Part 1: Database Functions
  // Create a movie with all parameters
  // Fail to create a movie with bad parameters (Change this for each error)
  // Get a movie with a movie id
  // Try to get a movie unsuccesfully with no id or pass in a nonstring
  // Create 150 of the same movies
  // Get a range of movies of movies default(skip = 0, take = 20)
  // Get a range of movies of movies with a take input greater than 100
  // Update all the parameters in the movie
  // Update a couple
  // Create a couple comments for a movie
  // Fail to create a couple of comments
  // Delete a couple of comments
  // Fail to delete a couple of comments
  // Part 2: Routing Functions
  // GET / with no parameters
  // GET / with parameters (test variations)
  // GET / with broken parameters
  // GET /:id with a movieId
  // GET /:id with a movieId that does not exist
  // POST / with correct parameters
  // POST / without correct parameters
  // PUT /:id with correct parameters
  // PUT /:id with fake movieID
  // PUT /:id with movieID but fake params
  // PATCH /:id with correct parameters
  // PATCH /:id with fake movieID
  // PATCH /:id with movieID but fake params
  // POST /:id/comments with correct parameters
  // POST /:id/comments without correct parameters
  // POST /:id/comments with fake movie but correct parameters
  // DELETE /:movieId/:commentId with real ids
  // DELETE /:movieId/:commentId with fake ids
  // Part 3: Logging Middleware (This is checked in tandem with Part 2)
  // Log reqCount each time- Delete before submission
  // Log ALL requestBodies, HTTP Verb, requestPath
  // Log each time a URL is requested

  // Create a movie with all parameters
  const movie1data = {
    title: "Bill and Ted Face the Music",
    cast: [
      { firstName: "Keanu", lastName: "Reeves" },
      { firstName: "Alex", lastName: "Winter" },
    ],
    info: { director: "Dean Parisot", yearReleased: 2020 },
    plot:
      "Once told they'd save the universe during a time-traveling adventure, 2 would-be rockers from San Dimas, California find themselves as middle-aged dads still trying to crank out a hit song and fulfill their destiny.",
    rating: 4.5,
  };
  const movie1 = await movieMethods.createMovie(
    movie1data.title,
    movie1data.cast,
    movie1data.info,
    movie1data.plot,
    movie1data.rating
  );
  const movie1id = movie1._id;
  // Fail to create a movie with bad parameters (Change this for each error)
  const movieFailData = {
    title: "Bill and Ted Face the Music",
    cast: [
      { firstName: "Keanu", lastName: "Reeves" },
      { firstName: "Alex", lastName: "Winter" },
    ],
    info: { director: "Dean Parisot", yearReleased: 2020 },
    plot:
      "Once told they'd save the universe during a time-traveling adventure, 2 would-be rockers from San Dimas, California find themselves as middle-aged dads still trying to crank out a hit song and fulfill their destiny.",
    rating: 4.5,
  };
  const movieFail = await movieMethods.createMovie(
    movieFailData.title,
    movieFailData.cast,
    movieFailData.info,
    movieFailData.plot,
    movieFailData.rating
  );
  // Get a movie with a movie id
  const movie1Take = await movieMethods.getMovie(movie1id);
  // Try to get a movie unsuccesfully with no id or pass in a nonstring
  // const movieFailTake = await movieMethods.getMovie("123456789012345678901234");
  // Create 150 of the same movies
  for (let i = 0; i < 150; ++i) {
    await movieMethods.createMovie(
      movie1data.title + i,
      movie1data.cast,
      movie1data.info,
      movie1data.plot,
      movie1data.rating
    );
  }
  // Get a range of movies of movies default(skip = 0, take = 20)
  const movieRange = await movieMethods.getMovies();
  // console.log(movieRange.length);
  // Get a range of movies of movies with a take input greater than 100
  // const movieRangeParams = await movieMethods.getMovies(-1, 2);
  // console.log(movieRangeParams);
  // Update all the parameters in the movie
  const movie1updated = await movieMethods.updateMovie(movie1id, {
    title: "Bill and Ted Face the Music Updated",
    cast: [{ firstName: "Asif", lastName: "Uddin" }],
    info: { director: "Asif Uddin", yearReleased: 2000 },
    plot: "Original one was too long so I made it short",
    rating: 1,
    comments: [
      { _id: new ObjectID(), name: "Bob", comment: "This movie is amazing" },
    ],
  });
  // Update a couple
  const movie1updatedFew = await movieMethods.updateMovie(movie1id, {
    // title: "Bill and Ted Face the Music Updated",
    cast: [{ firstName: "Asif", lastName: "Uddin" }],
    info: { director: "Asif Uddin", yearReleased: 2000 },
    plot: "Original one was too long so I made it short Part2",
    // rating: "1",
    comments: [
      {
        _id: new ObjectID(),
        name: "Billy Bob",
        comment: "This movie is amazing",
      },
    ],
  });
  // Create a couple comments for a movie
  const comment1movie1 = await commentsMethods.createComment(
    "Patrick",
    "Most Excellent Movie!",
    movie1id
  );
  const comment2movie1 = await commentsMethods.createComment(
    "Jason",
    "Bogus.. Most Heinous",
    movie1id
  );
  const comment3movie1 = await commentsMethods.createComment(
    "Mark",
    "Put them in the iron maiden",
    movie1id
  );
  const comment4movie1 = await commentsMethods.createComment(
    "Bill & Ted",
    "Excellent!!",
    movie1id
  );
  const comment5movie1 = await commentsMethods.createComment(
    "Mark",
    "Execute them!",
    movie1id
  );
  const comment6movie1 = await commentsMethods.createComment(
    "Bill & Ted",
    "Bogus!",
    movie1id
  );
  // Fail to create a couple of comments
  // commentFail = await commentsMethods.createComment("Bad", 98, "");
  // Delete a couple of comments
  const commentedMovie1 = await movieMethods.getMovie(movie1id);
  // console.log(commentedMovie1);
  const deleteComment1Movie1 = await commentsMethods.deleteComment(
    movie1id,
    commentedMovie1.comments[0]._id.toString()
  );
  // Fail to delete a couple of comments
  // const deleteFail = await commentsMethods.deleteComment(
  //   movie1id,
  //   commentedMovie1.comments[1]._id.toString()
  // );

  console.log("Done seeding database");
  await db.serverConfig.close();
}

main().catch((error) => {
  console.log(error);
});
