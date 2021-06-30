const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
const spaceRegex = /^ +$/gi;
const hex = /[0-9A-Fa-f]{6}/g;

function numberProvided(v, keyword) {
  if (!v) throw `No ${keyword} was provided`;
  if (typeof v !== "number") throw `${keyword} is not a number`;
}
function nEStringProvided(v, keyword) {
  if (!v) throw `No ${keyword} was provided`;
  if (typeof v != "string") throw `${keyword} is not a string`;
  if (spaceRegex.test(v)) throw `${keyword} is just an empty string`;
}

function errorHandling(title, cast, info, plot, rating) {
  nEStringProvided(title, "title");
  if (!Array.isArray(cast)) throw `${cast} is not an array`;
  if (cast.length === 0) throw `${cast} is an empty array`;
  for (member in cast) {
    nEStringProvided(cast[member].firstName, "First Name of A Cast Member");
    nEStringProvided(cast[member].lastName, "Last Name of A Cast Member");
  }
  if (typeof info !== "object" || info === null) {
    throw `${info} is not an object`;
  }
  nEStringProvided(info.director, "director");
  numberProvided(info.yearReleased, "Year Released");
  nEStringProvided(plot, "plot");
  numberProvided(rating, "Rating");
}
function idProvided(id) {
  if (typeof id !== "string") id = id.toString();
  if (id.length !== 24) throw "Id must be 24 hex characters long";
  nEStringProvided(id, "Id for the movie collection");
  let parsedId = ObjectID(id);
  return parsedId;
}
module.exports = {
  async createMovie(title, cast, info, plot, rating) {
    errorHandling(title, cast, info, plot, rating);
    const moviesCollection = await movies();
    let newMovie = {
      title: title,
      cast: cast,
      info: info,
      plot: plot,
      rating: rating,
      comments: [],
    };
    const insertInfo = await moviesCollection.insertOne(newMovie);
    if (insertInfo.insertedCount === 0)
      throw "Could not add movie to movie Collection";
    const movieId = insertInfo.insertedId;
    const addedMovie = await this.getMovie(movieId);
    addedMovie._id = addedMovie._id.toString();
    return addedMovie;
  },
  async getMovie(id) {
    const parsedId = idProvided(id);
    const moviesCollection = await movies();
    const movie = await moviesCollection.findOne({ _id: parsedId });
    if (movie === null) throw `Could not find a movie with the id: ${id}`;
    return movie;
  },
  async getMovies(skip = 0, take = 20) {
    if (skip !== 0) numberProvided(skip, "skip");
    numberProvided(take, "take");
    if (take > 100) throw `${take} can not be more than 100`;
    if (take <= 0) throw `${take} must be a positive number`;
    if (skip < 0) throw `${skip} must be a positive number`;
    const moviesCollection = await movies();
    const allMovies = await moviesCollection.find({}).toArray();
    if (skip > allMovies.length)
      throw `${skip} is larger than the total number of movies: ${allMovies.length}`;
    const moviesInRange = [];
    skip + take > allMovies.length
      ? (end = allMovies.length)
      : (end = skip + take);
    if (skip < allMovies.length) {
      for (i = skip; i < end; ++i) {
        allMovies[i]._id = allMovies[i]._id.toString();
        moviesInRange.push(allMovies[i]);
      }
    }
    return moviesInRange;
  },
  async updateMovie(id, updatedMovie) {
    parsedId = idProvided(id);
    const movie = await this.getMovie(id);
    const moviesCollection = await movies();
    if (updatedMovie.title) {
      nEStringProvided(updatedMovie.title, "title");
      movie.title = updatedMovie.title;
    }
    if (updatedMovie.cast) {
      if (!Array.isArray(updatedMovie.cast))
        throw `${updatedMovie.cast} is not an array`;
      if (updatedMovie.cast.length === 0)
        throw `${updatedMovie.cast} is an empty array`;
      for (member in updatedMovie.cast) {
        nEStringProvided(
          updatedMovie.cast[member].firstName,
          "First Name of A Cast Member"
        );
        nEStringProvided(
          updatedMovie.cast[member].lastName,
          "Last Name of A Cast Member"
        );
      }
      movie.cast = updatedMovie.cast;
    }
    if (updatedMovie.info) {
      if (typeof updatedMovie.info !== "object" && updatedMovie.info === null) {
        throw `${info} is not an object or null`;
      }
      nEStringProvided(updatedMovie.info.director, "director");
      numberProvided(updatedMovie.info.yearReleased, "Year Released");
      movie.info = updatedMovie.info;
    }
    if (updatedMovie.plot) {
      nEStringProvided(updatedMovie.plot, "Plot");
      movie.plot = updatedMovie.plot;
    }
    if (updatedMovie.rating) {
      numberProvided(updatedMovie.rating, "Rating");
      movie.rating = updatedMovie.rating;
    }
    if (updatedMovie.comments) {
      if (!Array.isArray(updatedMovie.comments))
        throw `${updatedMovie.comments} is not an array`;
      for (comment in updatedMovie.comments) {
        if (!updatedMovie.comments[comment]._id)
          throw "Comment does not have an ObjectID";
        nEStringProvided(
          updatedMovie.comments[comment].name,
          "Name of the Comment"
        );
        nEStringProvided(
          updatedMovie.comments[comment].comment,
          "Body of the Comment"
        );
      }
      movie.comments = updatedMovie.comments;
    }

    const updatedInfo = await moviesCollection.updateOne(
      { _id: parsedId },
      { $set: movie }
    );
    if (updatedInfo.modifiedCount === 0)
      throw `Could not update movie with id: ${id}`;
    const revisedMovie = await this.getMovie(id);
    revisedMovie._id = revisedMovie._id.toString();
    return revisedMovie;
  },
};
