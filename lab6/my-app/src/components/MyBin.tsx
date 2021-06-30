import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import qnm from "../qnm";

interface Post {
  id: string;
  url: string;
  description: string;
  posterName: string;
  binned: Boolean;
}
const MyBin = (): JSX.Element => {
  const { loading, error, data } = useQuery(qnm.GET_BINNED, {
    fetchPolicy: "cache-and-network",
  });
  const [updateBin] = useMutation(qnm.UPDATE_BIN);
  if (loading) {
    return (
      <div>
        <h2>Loading... </h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  } else {
    const { binnedImages } = data;
    console.log(binnedImages);
    return (
      <Container fluid>
        <ul className="nav justify-content-center">
          <li className="highlighted">
            <a className="currentPage" href="/my-bin">
              my bin
            </a>
          </li>
          <li>
            <a className="notPage" href="/">
              images
            </a>
          </li>
          <li>
            <a className="notPage" href="/my-posts">
              my-posts
            </a>
          </li>
        </ul>
        {binnedImages &&
          binnedImages.map((post: Post) => {
            return (
              <Row className="justify-content-center" key={post.id}>
                <Col sm={7} md={6} lg={5} className="imagepost">
                  <p className="postText">{post.description}</p>
                  <p className="postText">{`an image by: ${post.posterName}`}</p>
                  <Image src={post.url} alt={post.description} fluid />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      updateBin({
                        variables: { id: post.id, binned: false },
                      });
                      window.location.reload();
                      window.scrollTo(0, 0);
                    }}
                    className="binned"
                  >
                    remove from bin
                  </button>
                </Col>
              </Row>
            );
          })}
      </Container>
    );
  }
};

export default MyBin;
