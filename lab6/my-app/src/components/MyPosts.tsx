import React from "react";
import { Link } from "react-router-dom";
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
const MyPosts = () => {
  const { loading, error, data } = useQuery(qnm.GET_USERPOSTS);
  const [updateBin] = useMutation(qnm.UPDATE_BIN);
  const [deletePost] = useMutation(qnm.DELETE_POST);
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
    const { userPostedImages } = data;
    console.log(userPostedImages);
    return (
      <Container fluid>
        <ul className="nav justify-content-center">
          <li>
            <a className="notPage" href="/my-bin">
              my bin
            </a>
          </li>
          <li>
            <a className="notPage" href="/">
              images
            </a>
          </li>
          <li className="highlighted">
            <a className="currentPage" href="/my-posts">
              my-posts
            </a>
          </li>
        </ul>
        <Row className="justify-content-center">
          <Col sm={7} md={6} lg={5} className="uploadLink">
            <Link to="/new-post" className="uploadLinkText">
              Upload a Post
            </Link>
          </Col>
        </Row>
        {userPostedImages &&
          userPostedImages.map((post: Post) => {
            return (
              <Row className="justify-content-center" key={post.id}>
                <Col sm={7} md={6} lg={5} className="imagepost">
                  <p className="postText">{post.description}</p>
                  <p className="postText">{`an image by: ${post.posterName}`}</p>
                  <Image src={post.url} alt={post.description} fluid />
                  <Row className="justify-content-center">
                    {!post.binned ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          updateBin({
                            variables: { id: post.id, binned: true },
                          });
                          window.location.reload();
                        }}
                        className="binned"
                      >
                        add to bin
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          updateBin({
                            variables: { id: post.id, binned: false },
                          });
                          window.location.reload();
                        }}
                        className="binned"
                      >
                        remove from bin
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deletePost({
                          variables: { id: post.id },
                        });
                        window.location.reload();
                      }}
                      className="delete"
                    >
                      Delete Post
                    </button>
                  </Row>
                </Col>
              </Row>
            );
          })}
      </Container>
    );
  }
};

export default MyPosts;
