const express = require("express");
const { ResumeToken } = require("mongodb");
const router = express.Router();
const dataMethods = require("../data/index");
const moviesMethods = dataMethods.movies;
const commentsMethods = dataMethods.comments;

router.get("/", async (req, res) => {
  const query = req.query;
  let skip = 0,
    take = 20;
  if (query.skip) {
    if (typeof parseInt(query.skip) !== "number" || parseInt(query.skip) <= 0) {
      res
        .status(400)
        .json({ error: "You must provide a positive number for skip" });
      return;
    }
    skip = parseInt(query.skip);
  }
  if (query.take) {
    if (
      typeof parseInt(query.take) !== "number" ||
      parseInt(query.take) <= 0 ||
      parseInt(query.take) > 100
    ) {
      res.status(400).json({
        error: "You must provide a positive number less than 100 for take",
      });
      return;
    }
    take = parseInt(query.take);
  }
  try {
    const data = await moviesMethods.getMovies(skip, take);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: "Please choose a smaller skip number" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    await moviesMethods.getMovie(req.params.id.toString());
  } catch (e) {
    res.status(404).json({ error: "Movie not found" });
  }
  try {
    const data = await moviesMethods.getMovie(req.params.id.toString());
    res.json(data);
  } catch (e) {
    res.status(500).send();
  }
});
router.post("/", async (req, res) => {
  const movieData = req.body;
  if (!movieData) {
    res.status(400).json({ error: "You must provide a movie" });
    return;
  }
  if (!movieData.title) {
    res.status(400).json({ error: "Your must provide a movie title" });
    return;
  }
  if (!movieData.cast) {
    res.status(400).json({ error: "You must provide a movie cast" });
    return;
  }
  if (
    !movieData.info ||
    !movieData.info.director ||
    !movieData.info.yearReleased
  ) {
    res.status(400).json({ error: "You must provide a movie info" });
    return;
  }
  if (!movieData.plot) {
    res.status(400).json({ error: "You must provide a movie plot" });
    return;
  }
  if (!movieData.rating) {
    res.status(400).json({ error: "You must provide a movie rating" });
    return;
  }
  try {
    const { title, cast, info, plot, rating } = movieData;
    const newMovie = await moviesMethods.createMovie(
      title,
      cast,
      info,
      plot,
      rating
    );
    res.json(newMovie);
  } catch (e) {
    res.status(400).json({
      error: e,
    });
    return;
  }
});
router.put("/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    await moviesMethods.getMovie(req.params.id.toString());
  } catch (e) {
    res.status(404).json({ error: "Movie is not found" });
    return;
  }
  if (
    !updatedData.title ||
    !updatedData.cast ||
    !updatedData.info ||
    !updatedData.plot ||
    !updatedData.rating
  ) {
    res.status(400).json({ error: "You must supply all fields" });
    return;
  }
  try {
    const updatedMovie = await moviesMethods.updateMovie(
      req.params.id.toString(),
      updatedData
    );
    res.json(updatedMovie);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
});
router.patch("/:id", async (req, res) => {
  const requestBody = req.body;
  try {
    await moviesMethods.getMovie(req.params.id.toString());
  } catch (e) {
    res.status(404).json({ error: "Movie is not found" });
    return;
  }
  if (
    !requestBody.title &&
    !requestBody.cast &&
    !requestBody.info &&
    !requestBody.plot &&
    !requestBody.rating
  ) {
    res.status(400).json({ error: "You must supply one field to update" });
    return;
  }
  let updatedObject = {};
  try {
    const oldMovie = await moviesMethods.getMovie(req.params.id.toString());
    updatedObject = oldMovie;
    delete updatedObject._id;
    if (requestBody.title) {
      updatedObject.title = requestBody.title;
    }
    if (requestBody.cast) {
      updatedObject.cast = requestBody.cast;
    }
    if (requestBody.info) {
      updatedObject.info = requestBody.info;
    }
    if (requestBody.plot) {
      updatedObject.plot = requestBody.plot;
    }
    if (requestBody.rating) {
      updatedObject.rating = requestBody.rating;
    }
    const updatedMovie = await moviesMethods.updateMovie(
      req.params.id.toString(),
      updatedObject
    );
    res.json(updatedMovie);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});
router.post("/:id/comments", async (req, res) => {
  let commentData = req.body;
  try {
    await moviesMethods.getMovie(req.params.id.toString());
  } catch (e) {
    res.status(404).json({ error: "Movie not found" });
  }
  if (!commentData) {
    res.status(400).json({ error: "You must provide a comment" });
    return;
  }
  if (!commentData.name) {
    res.status(400).json({ error: "You must provide a comment name" });
    return;
  }
  if (!commentData.comment) {
    res.status(400).json({ error: "You must provide a comment body" });
    return;
  }
  try {
    const newComment = await commentsMethods.createComment(
      commentData.name,
      commentData.comment,
      req.params.id.toString()
    );
    res.json(newComment);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});
router.delete("/:movieId/:commentId", async (req, res) => {
  if (!req.params.movieId || !req.params.commentId) {
    res
      .status(400)
      .json({ error: "You must supply a movieId and a commentId to delete" });
    return;
  }
  try {
    await moviesMethods.getMovie(req.params.movieId.toString());
  } catch (e) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  let commentObject = {};
  const movieData = await moviesMethods.getMovie(req.params.movieId.toString());
  for (element in movieData.comments) {
    if (
      movieData.comments[element]._id.toString() ===
      req.params.commentId.toString()
    ) {
      commentObject = movieData.comments[element];
    }
  }
  if (commentObject === {}) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }
  try {
    const comment = await commentsMethods.deleteComment(
      req.params.movieId.toString(),
      req.params.commentId.toString()
    );
    res.json(comment);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

module.exports = router;
