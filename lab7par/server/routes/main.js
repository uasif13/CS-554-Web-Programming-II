const bluebird = require("bluebird");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const regex = /(<([^>]+)>)/gi;
const searchRegex = /^\s*$/;
const store = require("../../lab7/src/store");
const actions = require("../../lab7/src/actions");
const dotenv = require("dotenv");
dotenv.config();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/characters/page/:page", async (req, res) => {
  const page = req.params.page;

  const { characters } = store.getState();
  try {
    console.log(
      `https://gateway.marvel.com:443/v1/public/characters?ts=${
        characters.ts
      }&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${
        characters.hash
      }&limit=${characters.resultsPerPage}&offset=${
        characters.resultsPerPage * page
      }`
    );
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters?ts=${
        characters.ts
      }&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${
        characters.hash
      }&limit=${characters.resultsPerPage}&offset=${
        characters.resultsPerPage * page
      }`
    );
    console.log("data", data);
    store.dispatch(actions.CharacterList(data));
    console.log("dispatched");
    await client.setAsync(`characters/page/${page}`, JSON.stringify(data));
    console.log("cached");
    res.send(data);
  } catch (e) {
    // console.log("help");
    console.log(e);
  }
});
router.get("/characters/:id", async (req, res) => {
  const id = req.params.id;
  const { characters } = store.getState();
  try {
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${characters.ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${characters.hash}`
    );
    // console.log(
    //   `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}`
    // );
    store.dispatch(actions.CharacterPage(data));
    await client.setAsync(`characters/${id}`, JSON.stringify(data));
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});
router.get("/characters/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  const { ts, hash, resultsPerPage, offset } = store.getState();
  try {
    console.log(`in fetch searchTerm: ${keyword}`);
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${hash}&nameStartsWith=${keyword}&limit=${resultsPerPage}&offset=${offset}`
    );
    console.log(
      `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${hash}&nameStartsWith=${keyword}&limit=${resultsPerPage}&offset=${offset}`
    );
    store.dispatch(actions.CharacterSearch(data));
    await client.setAsync(`characters/search/${keyword}`, JSON.stringify(data));
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});
router.get("/comics/page/:page", async (req, res) => {
  const page = req.params.page;
  const { comics } = store.getState();
  try {
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/comics?ts=${comics.ts}&apikey=${
        process.env.REACT_APP_PUBLIC_KEY
      }&hash=${comics.hash}&limit=${comics.resultsPerPage}&offset=${
        comics.resultsPerPage * page
      }`
    );
    // console.log(
    //   `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${hash}&limit=${resultsPerPage}&offset=${offset}`
    // );
    store.dispatch(actions.ComicsList(data));
    await client.setAsync(`comics/page/${page}`, JSON.stringify(data));
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});
router.get("/comics/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  const { ts, hash, resultsPerPage, offset } = store.getState();
  try {
    console.log(`in fetch searchTerm: ${keyword}`);
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${hash}&nameStartsWith=${keyword}&limit=${resultsPerPage}&offset=${offset}`
    );
    console.log(
      `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${hash}&nameStartsWith=${keyword}&limit=${resultsPerPage}&offset=${offset}`
    );
    store.dispatch(actions.ComicsSearch(data));
    await client.setAsync(`comics/search/${keyword}`, JSON.stringify(data));
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});
router.get("/comics/:id", async (req, res) => {
  const id = req.params.id;
  const { comics } = store.getState();
  try {
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/comics/${id}?ts=${comics.ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${comics.hash}`
    );
    // console.log(
    //   `https://gateway.marvel.com:443/v1/public/comics/${id}?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}`
    // );
    store.dispatch(actions.ComicsPage(data));
    await client.setAsync(`comics/${id}`, JSON.stringify(data));
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});
router.get("/series/page/:page", async (req, res) => {
  const page = req.params.page;
  const { series } = store.getState();
  try {
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/series?ts=${series.ts}&apikey=${
        process.env.REACT_APP_PUBLIC_KEY
      }&hash=${series.hash}&limit=${series.resultsPerPage}&offset=${
        series.resultsPerPage * page
      }`
    );
    // console.log(
    //   `https://gateway.marvel.com:443/v1/public/series?ts=${ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${hash}&limit=${resultsPerPage}&offset=${offset}`
    // );
    store.dispatch(actions.SeriesList(data));
    await client.setAsync(`series/page/${page}`, JSON.stringify(data));
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});
router.get("/series/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  const { ts, hash, resultsPerPage, offset } = store.getState();
  try {
    console.log(`in fetch searchTerm: ${keyword}`);
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/series?ts=${ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${hash}&nameStartsWith=${keyword}&limit=${resultsPerPage}&offset=${offset}`
    );
    console.log(
      `https://gateway.marvel.com:443/v1/public/series?ts=${ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${hash}&nameStartsWith=${keyword}&limit=${resultsPerPage}&offset=${offset}`
    );
    store.dispatch(actions.SeriesSearch(data));
    await client.setAsync(`series/search/${keyword}`, JSON.stringify(data));
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});
router.get("/series/:id", async (req, res) => {
  const id = req.params.id;
  const { series } = store.getState();
  try {
    const { data } = await axios.get(
      `https://gateway.marvel.com:443/v1/public/series/${id}?ts=${series.ts}&apikey=${process.env.REACT_APP_PUBLIC_KEY}&hash=${series.hash}`
    );
    // console.log(
    //   `https://gateway.marvel.com:443/v1/public/series/${id}?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}`
    // );
    store.dispatch(actions.SeriesPage(data));
    await client.setAsync(`series/${id}`, JSON.stringify(data));
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
