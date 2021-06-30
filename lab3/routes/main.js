const bluebird = require("bluebird");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const regex = /(<([^>]+)>)/gi;
const searchRegex = /^\s*$/;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/", async (req, res) => {
  //   console.log("before api request");
  const { data } = await axios.get("http://api.tvmaze.com/shows");
  //   console.log(data[1]);
  res.render(
    "partials/showList",
    { showList: data },
    async function (err, html) {
      let cachedForShowList = await client.setAsync("showList", `${html}`);
      res.send(html);
    }
  );
});
router.get("/show/:id", async (req, res) => {
  //   console.log("hello");
  const id = req.params.id;
  try {
    const { data } = await axios.get(`http://api.tvmaze.com/shows/${id}`);
    data.summary = data.summary.replace(regex, "");
    // console.log(data);
    if (data.image == null) {
      data.image = { medium: "../public/noImage.png" };
    }
    // console.log(data);
    res.render("partials/show", { data: data }, async function (err, html) {
      let cachedForShowDetails = await client.setAsync(`${id}`, `${html}`);
      res.send(html);
    });
  } catch {
    res.status(404).render("partials/error", {
      error:
        "There is no show for the given ID. Please provide a positive number for a show",
    });
  }
  //   console.log(data);
});

router.post("/search", async (req, res) => {
  const postData = req.body;
  if (!postData.searchTerm || searchRegex.test(postData.searchTerm)) {
    res.status(400).render("partials/error", {
      error:
        "The searchItem is blank or just space. Please provide a valid searchItem",
    });
    return;
  }
  // console.log("hello");
  let cacheForSearchTermExists = await client.zincrbyAsync(
    "sortedSearchSet",
    1,
    `${postData.searchTerm}`
  );
  const { data } = await axios.get(
    ` http://api.tvmaze.com/search/shows?q=${postData.searchTerm}`
  );
  // console.log(data);
  res.render(
    "partials/search",
    { showResults: data },
    async function (err, html) {
      let cachedForShowDetails = await client.setAsync(
        `${postData.searchTerm}`,
        `${html}`
      );
      res.send(html);
    }
  );
});

router.get("/popularsearches", async (req, res) => {
  let cacheForpopSearches = await client.zrangeAsync(
    "sortedSearchSet",
    -10,
    -1,
    "WITHSCORES"
  );
  cacheForpopSearches.reverse();
  result = [];
  for (let i = 1; i < cacheForpopSearches.length; i += 2) {
    result.push(
      `The searchTerm ${cacheForpopSearches[i]} has ${
        cacheForpopSearches[i - 1]
      } searches`
    );
  }
  // console.log(result);
  res.render("partials/popSearch", { popSearches: result });
});

module.exports = router;
