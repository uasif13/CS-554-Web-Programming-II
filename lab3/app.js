const bluebird = require("bluebird");
const express = require("express");
const configRoutes = require("./routes");
const app = express();
const redis = require("redis");
const client = redis.createClient();
const static = express.static(__dirname + "/public");
const searchRegex = /^\s*$/;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const exphbs = require("express-handlebars");
app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", async (req, res, next) => {
  let cacheForShowListExists = await client.getAsync("showList");
  //   console.log(cacheForShowListExists);
  if (cacheForShowListExists) {
    // console.log("Cached showList");
    res.send(cacheForShowListExists);
  } else {
    // console.log("No cached showList");
    next();
  }
});

app.get("/show/:id", async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);
  let cacheForShowDetailsExists = await client.getAsync(`${id}`);
  //   console.log(cacheForShowDetailsExists);
  if (cacheForShowDetailsExists) {
    res.send(cacheForShowDetailsExists);
  } else {
    // console.log("no cached show");
    next();
  }
});

app.post("/search", async (req, res, next) => {
  const postData = req.body;
  if (!postData.searchTerm || searchRegex.test(postData.searchTerm)) {
    res.status(400).render("partials/error", {
      error:
        "The searchItem is blank or just space. Please provide a valid searchItem",
    });
    return;
  }
  let cacheForSearchTermExists = await client.zincrbyAsync(
    "sortedSearchSet",
    1,
    `${postData.searchTerm}`
  );
  //   console.log(cacheForShowDetailsExists);
  let cacheForSearchResults = await client.getAsync(`${postData.searchTerm}`);
  if (cacheForSearchResults) {
    res.send(cacheForSearchResults);
  } else {
    next();
  }
});

configRoutes(app);
app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
