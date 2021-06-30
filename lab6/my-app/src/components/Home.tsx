import React, { useState } from "react";
import refreshLogo from "../retweet-solid.svg";
import { useQuery, useMutation } from "@apollo/client";
import { Container, Row, Col, Image } from "react-bootstrap";
import qnm from "../qnm";

interface Post {
  id: string;
  url: string;
  description: string;
  posterName: string;
  binned: Boolean;
}
interface BinnedImage {
  id: string;
}
const Home = (): JSX.Element => {
  const [pageNum, setPageNum] = useState<number>(1);
  const { loading, error, data, refetch } = useQuery(qnm.GET_UNSPLASH, {
    variables: { pageNum: pageNum },
    fetchPolicy: "cache-and-network",
  });
  const [updateBin] = useMutation(qnm.UPDATE_BIN);
  const postInBin = (post: Post, binnedImages: BinnedImage[]) => {
    let binned = false;
    for (let i = 0; i < binnedImages.length; i++) {
      if (post.id === binnedImages[i].id) {
        binned = true;
      }
    }
    return binned;
  };
  if (loading) {
    return (
      <div>
        <h2>Loading... </h2>
      </div>
    );
  } else if (error) {
    return <div>{error.message}</div>;
  } else {
    const { unsplashImages, binnedImages } = data;
    // console.log(data);
    return (
      <Container fluid>
        <ul className="nav justify-content-center">
          <li>
            <a className="notPage" href="/my-bin">
              my bin
            </a>
          </li>
          <li className="highlighted">
            <a className="currentPage" href="/">
              images
            </a>
          </li>
          <li>
            <a className="notPage" href="/my-posts">
              my-posts
            </a>
          </li>
        </ul>
        {unsplashImages &&
          unsplashImages.map((post: Post) => {
            return (
              <Row className="justify-content-center" key={post.url}>
                <Col sm={7} md={6} lg={5} className="imagepost">
                  <p className="postText">{post.description}</p>
                  <p className="postText">{`an image by: ${post.posterName}`}</p>
                  <Image src={post.url} alt={post.description} fluid />
                  {!postInBin(post, binnedImages) ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        updateBin({
                          variables: { id: post.id, binned: true },
                        });
                        window.location.reload();
                        // refetch({
                        //   pageNum: pageNum,
                        // });
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
                        // refetch({
                        //   pageNum: pageNum,
                        // });
                      }}
                      className="binned"
                    >
                      remove from bin
                    </button>
                  )}
                </Col>
              </Row>
            );
          })}
        <button
          onClick={(e) => {
            e.preventDefault();
            setPageNum(pageNum + 1);
            refetch({
              pageNum: pageNum,
            });
          }}
          className="refreshUnsplash"
        >
          <img src={refreshLogo} className="App-logo" alt="refreshLogo" />
        </button>
      </Container>
    );
  }
};

export default Home;
