const CharacterList = (data) => ({
  type: "GET_CHARACTER_LIST_DATA",
  payload: {
    data: data,
  },
});
const CharacterSearch = (searchData) => ({
  type: "GET_CHARACTER_SEARCH_DATA",
  payload: {
    searchData: searchData,
  },
});
const CharacterKeyword = (searchTerm) => ({
  type: "SET_CHARACTER_SEARCHTERM",
  payload: {
    searchTerm: searchTerm,
  },
});
const CharacterPage = (showData) => ({
  type: "GET_CHARACTER_ID_DATA",
  payload: {
    showData: showData,
  },
});
const ComicsList = (data) => ({
  type: "GET_COMIC_LIST_DATA",
  payload: {
    data: data,
  },
});
const ComicsSearch = (searchData) => ({
  type: "GET_COMIC_SEARCH_DATA",
  payload: {
    searchData: searchData,
  },
});
const ComicsKeyword = (searchTerm) => ({
  type: "SET_COMIC_SEARCHTERM",
  payload: {
    searchTerm: searchTerm,
  },
});
const ComicsPage = (showData) => ({
  type: "GET_COMIC_ID_DATA",
  payload: {
    showData: showData,
  },
});
const SeriesList = (data) => ({
  type: "GET_SERIES_LIST_DATA",
  payload: {
    data: data,
  },
});
const SeriesSearch = (searchData) => ({
  type: "GET_SERIES_SEARCH_DATA",
  payload: {
    searchData: searchData,
  },
});
const SeriesKeyword = (searchTerm) => ({
  type: "SET_SERIES_SEARCHTERM",
  payload: {
    searchTerm: searchTerm,
  },
});
const SeriesPage = (showData) => ({
  type: "GET_SERIES_ID_DATA",
  payload: {
    showData: showData,
  },
});

module.exports = {
  CharacterList,
  CharacterSearch,
  CharacterKeyword,
  CharacterPage,
  ComicsList,
  ComicsSearch,
  ComicsKeyword,
  ComicsPage,
  SeriesList,
  SeriesPage,
  SeriesSearch,
  SeriesKeyword,
};
