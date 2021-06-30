const md5 = require("blueimp-md5");
const dotenv = require("dotenv");
dotenv.config();
const initialState = {
  ts: 1,
  hash: md5(
    1 + process.env.REACT_APP_PRIVATE_KEY + process.env.REACT_APP_PUBLIC_KEY
  ),
  showData: undefined,
  searchData: undefined,
  data: undefined,
  searchTerm: "",
  resultsPerPage: 20,
  totalResults: 0,
  page: 0,
  offset: 0,
  loading: true,
  error: false,
  regex: /(<([^>]+)>)/gi,
};

const SeriesReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_SERIES_LIST_DATA":
      console.log("payload ", payload);
      state.data = payload.data.data;
      state.totalResults = payload.data.data.totalResults;
      state.loading = false;
      return state;
    case "GET_SERIES_SEARCH_DATA":
      console.log("payload ", payload);
      state.searchData = payload.searchData.data;
      state.totalResults = payload.searchData.data.totalResults;
      state.loading = false;
      return state;
    case "SET_SERIES_SEARCHTERM":
      console.log("payload ", payload);
      state.searchTerm = payload.searchTerm;
      return state;
    case "GET_SERIES_ID_DATA":
      console.log("payload ", payload);
      state.showData = payload.showData.data;
      state.loading = false;
      return state;
  }
  return state;
};

module.exports = SeriesReducer;
