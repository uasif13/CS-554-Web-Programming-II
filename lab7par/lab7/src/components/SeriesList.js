import React, { useEffect, useState } from "react";
import axios from "axios";
import md5 from "blueimp-md5";
import Search from "./Search";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";

const SeriesList = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const series = useSelector((state) => state.series);
  console.log(series);
  const {
    ts,
    hash,
    searchData,
    data,
    searchTerm,
    resultsPerPage,
    totalResults,
    offset,
  } = series;
  const regex = /(<([^>]+)>)/gi;
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/series/page/${props.match.params.page}`
        );
        dispatch(actions.SeriesList(data));
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
          `https://gateway.marvel.com:443/v1/public/series?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}&titleStartsWith=${searchTerm}&limit=${resultsPerPage}&offset=${offset}`
        );
        console.log(
          `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}&titleStartsWith=${searchTerm}&limit=${resultsPerPage}&offset=${offset}`
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
              to={`/series/page/${parseInt(props.match.params.page) - 1}`}
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
            to={`/series/page/${parseInt(props.match.params.page) + 1}`}
          >
            Next
          </Link>
        </Row>
        <Row>
          {searchData &&
            searchData.data.results.map((series) => {
              return (
                <Col sm={8} md={4} lg={3} key={series.id}>
                  <Card>
                    <Card.Link
                      style={{ color: "black" }}
                      href={`/series/${series.id}`}
                    >
                      <Card.Img
                        variant="top"
                        src={`${series.thumbnail.path}/portrait_uncanny.${series.thumbnail.extension}`}
                        alt={`${series.title}`}
                      />
                      <Card.Body>
                        <Card.Title>{`${series.title}`}</Card.Title>
                        <Card.Text>
                          {series.description === "" ||
                          series.description === null
                            ? "No description available"
                            : `${series.description.replace(regex, "")}`}
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
              to={`/series/page/${parseInt(props.match.params.page) - 1}`}
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
            to={`/series/page/${parseInt(props.match.params.page) + 1}`}
          >
            Next
          </Link>
        </Row>
        <Row>
          {series.data &&
            series.data.results.map((series) => {
              return (
                <Col sm={8} md={4} lg={3} key={series.id}>
                  <Card>
                    <Card.Link
                      style={{ color: "black" }}
                      href={`/series/${series.id}`}
                    >
                      <Card.Img
                        variant="top"
                        src={`${series.thumbnail.path}/portrait_uncanny.${series.thumbnail.extension}`}
                        alt={`${series.title}`}
                      />
                      <Card.Body>
                        <Card.Title>{`${series.title}`}</Card.Title>
                        <Card.Text>
                          {series.description === "" ||
                          series.description === null
                            ? "No description available"
                            : `${series.description.replace(regex, "")}`}
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

export default SeriesList;
