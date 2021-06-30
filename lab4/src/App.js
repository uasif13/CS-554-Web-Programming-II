import React from "react";
import logo from "./logo.svg";
import "./App.css";
import CharacterList from "./components/CharacterList";
import Character from "./components/Character";
import Home from "./components/Home";
import Comic from "./components/Comic";
import Series from "./components/Series";
import SeriesList from "./components/SeriesList";
import ComicList from "./components/ComicList";
import NotFound from "./components/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-body">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/characters/page/:page"
              component={CharacterList}
            />
            <Route exact path="/characters/:id" component={Character} />
            <Route exact path="/comics/page/:page" component={ComicList} />
            <Route exact path="/comics/:id" component={Comic} />
            <Route exact path="/series/page/:page" component={SeriesList} />
            <Route exact path="/series/:id" component={Series} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
