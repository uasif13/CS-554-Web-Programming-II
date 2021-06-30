const bluebird = require("bluebird");
const express = require("express");
const redis = require("redis");
const app = express();
const configRoutes = require("./routes");
const client = redis.createClient();
const cors = require("cors");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/characters/page/:page", async (req, res, next) => {
  const page = req.params.page;
  let cacheForCharacterListExists = await client.getAsync(
    `characters/page/${page}`
  );
  if (cacheForCharacterListExists) {
    res.send(JSON.parse(cacheForCharacterListExists));
  } else {
    next();
  }
});
app.get("/characters/:id", async (req, res, next) => {
  const id = req.params.id;
  let cacheForCharacterExists = await client.getAsync(`characters/${id}`);
  if (cacheForCharacterExists) {
    res.send(JSON.parse(cacheForCharacterExists));
  } else {
    next();
  }
});
app.get("/characters/search/:keyword", async (req, res, next) => {
  const keyword = req.params.keyword;
  let cacheForCharacterSearchExists = await client.getAsync(
    `characters/search/${keyword}`
  );
  if (cacheForCharacterSearchExists) {
    res.send(JSON.parse(cacheForCharacterSearchExists));
  } else {
    next();
  }
});
app.get("/comics/page/:page", async (req, res, next) => {
  const page = req.params.page;
  let cacheForComicsListExists = await client.getAsync(`comics/page/${page}`);
  if (cacheForComicsListExists) {
    res.send(JSON.parse(cacheForComicsListExists));
  } else {
    next();
  }
});
app.get("/comics/:id", async (req, res, next) => {
  const id = req.params.id;
  let cacheForComicsExists = await client.getAsync(`comics/${id}`);
  if (cacheForComicsExists) {
    res.send(JSON.parse(cacheForComicsExists));
  } else {
    next();
  }
});
app.get("/comics/search/:keyword", async (req, res, next) => {
  const keyword = req.params.keyword;
  let cacheForComicsSearchExists = await client.getAsync(
    `comics/search/${keyword}`
  );
  if (cacheForComicsSearchExists) {
    res.send(JSON.parse(cacheForComicsSearchExists));
  } else {
    next();
  }
});
app.get("/series/page/:page", async (req, res, next) => {
  const page = req.params.page;
  let cacheForSeriesListExists = await client.getAsync(`series/page/${page}`);
  if (cacheForSeriesListExists) {
    res.send(JSON.parse(cacheForSeriesListExists));
  } else {
    next();
  }
});
app.get("/series/:id", async (req, res, next) => {
  const id = req.params.id;
  let cacheForSeriesExists = await client.getAsync(`series/${id}`);
  if (cacheForSeriesExists) {
    res.send(JSON.parse(cacheForSeriesExists));
  } else {
    next();
  }
});
app.get("/series/search/:keyword", async (req, res, next) => {
  const keyword = req.params.keyword;
  let cacheForSeriesSearchExists = await client.getAsync(
    `series/search/${keyword}`
  );
  if (cacheForSeriesSearchExists) {
    res.send(JSON.parse(cacheForSeriesSearchExists));
  } else {
    next();
  }
});

configRoutes(app);

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
