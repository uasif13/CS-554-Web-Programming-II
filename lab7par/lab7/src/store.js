const redux = require("redux");
const tools = require("redux-devtools-extension");

const rootReducer = require("./reducers/rootReducer");

const store = redux.createStore(rootReducer, tools.composeWithDevTools());

module.exports = store;
