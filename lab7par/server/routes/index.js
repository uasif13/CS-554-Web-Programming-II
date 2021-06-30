const mainRoutes = require("./main");
const constructor = (app) => {
  app.use("/", mainRoutes);
  app.use("*", async (req, res) => {
    res.status(404).send({ error: "Please provide a valid path" });
  });
};

module.exports = constructor;
