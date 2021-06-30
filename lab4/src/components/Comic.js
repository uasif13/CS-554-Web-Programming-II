import React, { useEffect, useState } from "react";
import axios from "axios";
import md5 from "blueimp-md5";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";

const Comic = (props) => {
  const ts = new Date().getTime();
  const { REACT_APP_PUBLIC_KEY, REACT_APP_PRIVATE_KEY } = process.env;
  const hash = md5(ts + REACT_APP_PRIVATE_KEY + REACT_APP_PUBLIC_KEY);
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const regex = /(<([^>]+)>)/gi;
  useEffect(() => {
    console.log("useEffect fired");
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://gateway.marvel.com:443/v1/public/comics/${props.match.params.id}?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}`
        );
        console.log(
          `https://gateway.marvel.com:443/v1/public/comics/${props.match.params.id}?ts=${ts}&apikey=${REACT_APP_PUBLIC_KEY}&hash=${hash}`
        );
        setShowData(data.data);
        console.log(showData);
      } catch (e) {
        setError(true);
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [props.match.params.id]);
  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    return <Redirect to="/NotFound" />;
  } else {
    console.log(showData);
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col sm={12} md={10} lg={8}>
            <Card>
              <Card.Img
                variant="top"
                src={`${showData.results[0].thumbnail.path}/portrait_uncanny.${showData.results[0].thumbnail.extension}`}
                alt={`${showData.results[0].title}`}
              />
              <Card.Body>
                <Card.Title>{`${showData.results[0].title}`}</Card.Title>
                <Card.Text>
                  {showData.results[0].description === "" ||
                  showData.results[0].description === null
                    ? "No description available"
                    : `${showData.results[0].description.replace(regex, "")}`}
                </Card.Text>
              </Card.Body>
              <Card.Subtitle className="mb-2 text-muted">
                Characters
              </Card.Subtitle>
              <ListGroup className="list-group-flush">
                {showData.results[0].characters.items
                  ? showData.results[0].characters.items.map((characters) => {
                      return (
                        <Link
                          style={{
                            color: "#667892",
                          }}
                          to={`/characters/${characters.resourceURI.substring(
                            47
                          )}`}
                        >{`${characters.name}`}</Link>
                      );
                    })
                  : showData.results[0].characters && (
                      <Link
                        style={{
                          color: "#667892",
                        }}
                        to={`/series/${showData.results[0].characters.resourceURI.substring(
                          47
                        )}`}
                      >{`${showData.results[0].characters.name}`}</Link>
                    )}
              </ListGroup>
              <br />
              <Card.Subtitle className="mb-2 text-muted">Series</Card.Subtitle>
              <ListGroup className="list-group-flush">
                {showData.results[0].series.items
                  ? showData.results[0].series.items.map((series) => {
                      return (
                        <Link
                          style={{
                            color: "#667892",
                          }}
                          to={`/series/${series.resourceURI.substring(43)}`}
                        >{`${series.name}`}</Link>
                      );
                    })
                  : showData.results[0].series && (
                      <Link
                        style={{
                          color: "#667892",
                        }}
                        to={`/series/${showData.results[0].series.resourceURI.substring(
                          43
                        )}`}
                      >{`${showData.results[0].series.name}`}</Link>
                    )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Comic;
