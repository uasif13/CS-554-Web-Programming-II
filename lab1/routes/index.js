const moviesRoutes = require("./movies");

const constructor = (app) => {
  app.use("/api/movies", moviesRoutes);
  app.use("*", (_, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructor;
