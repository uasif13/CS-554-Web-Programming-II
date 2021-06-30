import React, { useEffect, useState } from "react";
import axios from "axios";
import md5 from "blueimp-md5";
import Search from "./Search";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

const CharacterList = (props) => {
  const ts = new Date().getTime();
  const { REACT_APP_PUBLIC_KEY, REACT_APP_PRIVATE_KEY } = process.env;
  const hash = md5(ts + REACT_APP_PRIVATE_KEY + REACT_APP_PUBLIC_KEY);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [totalResults, setTotalResults] = useState(0);
  const offset = resultsPerPage * props.match.params.page;
  const regex = /(<([^>]+)>)/gi;
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}&limit=${resultsPerPage}&offset=${offset}`
        );
        console.log(
          `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}&limit=${resultsPerPage}&offset=${offset}`
        );
        setTotalResults(data.data.total);
        setData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, [props.match.params.page]);
  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}&nameStartsWith=${searchTerm}&limit=${resultsPerPage}&offset=${offset}`
        );
        console.log(
          `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}&nameStartsWith=${searchTerm}&limit=${resultsPerPage}&offset=${offset}`
        );
        setTotalResults(data.data.total);
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchData();
    }
  }, [searchTerm]);
  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  if (loading) {
    return (
      <div>
        <h2>Loading ...</h2>
      </div>
    );
  } else if (offset > totalResults) {
    return <Redirect to="/NotFound" />;
  } else if (searchTerm) {
    return (
      <Container fluid>
        <Row>
          <Search searchValue={searchValue} />
        </Row>
        <Row>
          {props.match.params.page > 0 && (
            <Link
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "1em 1.5em",
                textDecoration: "none",
                textTransform: "uppercase",
                margin: "1em",
              }}
              to={`/characters/page/${parseInt(props.match.params.page) - 1}`}
            >
              Previous
            </Link>
          )}

          <Link
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "1em 1.5em",
              margin: "1em",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
            to={`/characters/page/${parseInt(props.match.params.page) + 1}`}
          >
            Next
          </Link>
        </Row>
        <Row>
          {searchData &&
            searchData.data.results.map((character) => {
              return (
                <Col sm={8} md={4} lg={3} key={character.id}>
                  <Card>
                    <Card.Link
                      style={{ color: "black" }}
                      href={`/characters/${character.id}`}
                    >
                      <Card.Img
                        variant="top"
                        src={`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`}
                        alt={`${character.name}`}
                      />
                      <Card.Body>
                        <Card.Title>{`${character.name}`}</Card.Title>
                        <Card.Text>
                          {character.description === "" ||
                          character.description === null
                            ? "No description available"
                            : `${character.description.replace(regex, "")}`}
                        </Card.Text>
                      </Card.Body>
                    </Card.Link>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Container>
    );
  } else {
    return (
      <Container fluid>
        <Row>
          <Search searchValue={searchValue} />
        </Row>
        <Row>
          {props.match.params.page > 0 && (
            <Link
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "1em 1.5em",
                textDecoration: "none",
                textTransform: "uppercase",
                margin: "1em",
              }}
              to={`/characters/page/${parseInt(props.match.params.page) - 1}`}
            >
              Previous
            </Link>
          )}

          <Link
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "1em 1.5em",
              margin: "1em",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
            to={`/characters/page/${parseInt(props.match.params.page) + 1}`}
          >
            Next
          </Link>
        </Row>
        <Row>
          {data.data.results.map((character) => {
            return (
              <Col sm={8} md={4} lg={3} key={character.id}>
                <Card>
                  <Card.Link
                    style={{ color: "black" }}
                    href={`/characters/${character.id}`}
                  >
                    <Card.Img
                      variant="top"
                      src={`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`}
                      alt={`${character.name}`}
                    />
                    <Card.Body>
                      <Card.Title>{`${character.name}`}</Card.Title>
                      <Card.Text>
                        {character.description === "" ||
                        character.description === null
                          ? "No description available"
                          : `${character.description.replace(regex, "")}`}
                      </Card.Text>
                    </Card.Body>
                  </Card.Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }
};

export default CharacterList;
