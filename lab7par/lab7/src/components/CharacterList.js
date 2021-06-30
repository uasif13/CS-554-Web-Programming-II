import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "./Search";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";

const CharacterList = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const character = useSelector((state) => state.characters);
  console.log(character);
  const {
    ts,
    hash,
    searchData,
    data,
    searchTerm,
    resultsPerPage,
    totalResults,
    offset,
  } = character;
  const regex = /(<([^>]+)>)/gi;
  useEffect(() => {
    console.log("page useEffect fired");
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/characters/page/${props.match.params.page}`
        );
        dispatch(actions.CharacterList(data));
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
          `http://localhost:4000/characters/search/${searchTerm}`
        );
        searchData = data;
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
    dispatch(actions.CharacterKeyword(value));
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
          {character.data &&
            character.data.results.map((character) => {
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
