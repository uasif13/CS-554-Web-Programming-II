const mainRoutes = require("./main");
const constructor = (app) => {
  app.use("/", mainRoutes);
  app.use("*", async (req, res) => {
    res
      .status(404)
      .render("partials/error", { error: "Please provide a valid path" });
  });
};

module.exports = constructor;
