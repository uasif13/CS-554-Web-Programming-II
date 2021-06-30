import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import qnm from "../qnm";
const NewPost = () => {
  const [formState, setFormState] = useState({
    url: "",
    description: "",
    posterName: "",
  });
  const [uploadImage] = useMutation(qnm.ADD_USERPOST, {
    variables: {
      url: formState.url,
      description: formState.description,
      posterName: formState.posterName,
    },
  });
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
        <li>
          <a className="notPage" href="/my-posts">
            my-posts
          </a>
        </li>
      </ul>
      <Row className="justify-content-center">
        <Col sm={11} md={10} lg={9} className="imagepost">
          <p id="newpostTitle">Create a Post</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              uploadImage({ variables: formState });
              setFormState({ url: "", description: "", posterName: "" });
            }}
            name="uploadPost"
          >
            <label htmlFor="description" className="labels">
              Description:
            </label>
            <br />
            <input
              type="text"
              id="description"
              name="description"
              className="inputBox"
              value={formState.description}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  description: e.target.value,
                });
              }}
              placeholder="description"
              required
              pattern=".*\S.*"
            />
            <br />
            <br />
            <label htmlFor="url" className="labels">
              Image URL:
            </label>
            <br />
            <input
              type="url"
              id="url"
              name="url"
              className="inputBox"
              value={formState.url}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  url: e.target.value,
                });
              }}
              placeholder="url"
            />
            <br />
            <br />
            <label htmlFor="posterName" className="labels">
              Author Name:
            </label>
            <br />
            <input
              type="text"
              id="posterName"
              name="posterName"
              className="inputBox"
              value={formState.posterName}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  posterName: e.target.value,
                });
              }}
              placeholder="posterName (author)"
              required
              pattern=".*\S.*"
            />
            <br />
            <br />
            <input type="submit" value="Submit" className="binned" />
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewPost;
