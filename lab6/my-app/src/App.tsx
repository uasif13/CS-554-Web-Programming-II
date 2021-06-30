import React from "react";
import logo from "./trash-alt-regular.svg";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import MyBin from "./components/MyBin";
import MyPosts from "./components/MyPosts";
import NewPost from "./components/NewPost";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Binterest</h1>
        </header>
        <div className="App-body">
          <Router>
            <Route exact path="/" component={Home} />
            <Route exact path="/my-bin/" component={MyBin} />
            <Route exact path="/my-posts/" component={MyPosts} />
            <Route exact path="/new-post/" component={NewPost} />
          </Router>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
