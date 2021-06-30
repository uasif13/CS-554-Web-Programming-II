const { ObjectID } = require("mongodb");
const moviesMethods = require("./movies");
const spaceRegex = /^ +$/gi;
const hex = /[0-9A-Fa-f]{6}/g;

function nEStringProvided(v, keyword) {
  if (!v) throw `No ${keyword} was provided`;
  if (typeof v != "string") throw `${keyword} is not a string`;
  if (spaceRegex.test(v)) throw `${keyword} is just an empty string`;
}

function errorHandling(name, comment, movieId) {
  nEStringProvided(name, "Name");
  nEStringProvided(comment, "Body of Comment");
  nEStringProvided(movieId, "Movie of Comment");
  if (movieId.length !== 24) throw "String must be 24 hex characters long";
}
module.exports = {
  async createComment(name, comment, movieId) {
    errorHandling(name, comment, movieId);
    const movieBeingCommented = await moviesMethods.getMovie(ObjectID(movieId));
    let newComment = {
      _id: new ObjectID(),
      name: name,
      comment: comment,
    };
    movieBeingCommented.comments.push(newComment);
    const output = await moviesMethods.updateMovie(
      movieId,
      movieBeingCommented
    );
    return output;
  },
  async deleteComment(movieId, commentId) {
    nEStringProvided(movieId, "movieId");
    if (movieId.length !== 24 || !hex.test(movieId))
      throw "MovieId must be 24 hex characters long";
    nEStringProvided(commentId, "commentId");
    if (commentId.length !== 24 || !hex.test(commentId))
      throw "CommentId must be 24 hex characters long";
    const movieToEdit = await moviesMethods.getMovie(ObjectID(movieId));
    for (i = 0; i < movieToEdit.comments.length; ++i) {
      if (movieToEdit.comments[i]._id.toString() === commentId) {
        movieToEdit.comments.splice(i, 1);
        const output = await moviesMethods.updateMovie(
          movieToEdit._id,
          movieToEdit
        );
        return output;
      }
    }
    throw "No Commment with Id for the Provided Movie";
  },
};
