import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <p>
        This is Asif Uddin's Marvel API. Start by clicking the links below to go
        to the respective page lists of either characters, comics, or series
      </p>
      <p>
        The application queries six of Marvel's endpoints. The AUTH part depends
        on the user and requires a timestamp, public key, and hash. Look at
        <a
          style={{
            color: "#667892",
          }}
          href="https://developer.marvel.com/documentation/authorization"
        >
          https://developer.marvel.com/documentation/authorization
        </a>{" "}
        for more details:{" \n"}
        <a
          style={{
            color: "#667892",
          }}
          href="https://gateway.marvel.com:443/v1/public/characters?AUTH"
        >
          https://gateway.marvel.com:443/v1/public/characters/?AUTH
        </a>{" "}
        for getting a list of characters{" \n"}
        <a
          style={{
            color: "#667892",
          }}
          href="https://gateway.marvel.com:443/v1/public/characters/:characterId?AUTH"
        >
          https://gateway.marvel.com:443/v1/public/characters/:characterId?AUTH
        </a>{" "}
        for getting details on a character{" \n"}
        <a
          style={{
            color: "#667892",
          }}
          href="https://gateway.marvel.com:443/v1/public/comics?AUTH"
        >
          https://gateway.marvel.com:443/v1/public/comics/?AUTH
        </a>{" "}
        for getting a list of comics{" \n"}
        <a
          style={{
            color: "#667892",
          }}
          href="https://gateway.marvel.com:443/v1/public/comics/:comicId?AUTH"
        >
          https://gateway.marvel.com:443/v1/public/comics/:comicId?AUTH
        </a>{" "}
        for getting details on a comics{" \n"}
        <a
          style={{
            color: "#667892",
          }}
          href="https://gateway.marvel.com:443/v1/public/series?AUTH"
        >
          https://gateway.marvel.com:443/v1/public/series/?AUTH
        </a>{" "}
        for getting a list of series{" \n"}
        <a
          style={{
            color: "#667892",
          }}
          href="https://gateway.marvel.com:443/v1/public/series/:seriesId?AUTH"
        >
          https://gateway.marvel.com:443/v1/public/series/:seriesId?AUTH
        </a>{" "}
        for getting details on a series{" \n"}
      </p>
      <p>
        Here are three links in our application will lead you to a list of
        either characters, comics, or series
      </p>
      <ul>
        <li>
          <Link
            style={{
              color: "#667892",
            }}
            to={"/characters/page/0"}
          >
            Character Pages
          </Link>
        </li>
        <li>
          <Link
            style={{
              color: "#667892",
            }}
            to={"/comics/page/0"}
          >
            Comics Pages
          </Link>
        </li>
        <li>
          <Link
            style={{
              color: "#667892",
            }}
            to={"/series/page/0"}
          >
            Series Pages
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
