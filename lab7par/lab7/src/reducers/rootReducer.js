const redux = require("redux");
const CharacterReducer = require("./CharacterReducer");
const ComicReducer = require("./ComicReducer");
const SeriesReducer = require("./SeriesReducer");

const reducers = redux.combineReducers({
  characters: CharacterReducer,
  comics: ComicReducer,
  series: SeriesReducer,
});

module.exports = reducers;
