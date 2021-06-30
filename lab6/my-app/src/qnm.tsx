import { gql } from "@apollo/client";

const GET_UNSPLASH = gql`
  query load($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      description
      posterName
      binned
    }
    binnedImages {
      id
    }
  }
`;

const GET_BINNED = gql`
  query loadBin {
    binnedImages {
      id
      url
      description
      posterName
      binned
    }
  }
`;

const GET_USERPOSTS = gql`
  query loadUser {
    userPostedImages {
      id
      url
      description
      posterName
      binned
    }
  }
`;

const ADD_USERPOST = gql`
  mutation userimage($url: String!, $posterName: String, $description: String) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
    }
  }
`;

const UPDATE_BIN = gql`
  mutation updateBin($id: ID!, $binned: Boolean) {
    updateImage(id: $id, binned: $binned) {
      id
    }
  }
`;

const DELETE_POST = gql`
  mutation userimage($id: ID!) {
    deleteImage(id: $id) {
      url
      posterName
      description
      userPosted
    }
  }
`;

export default {
  GET_UNSPLASH,
  GET_BINNED,
  GET_USERPOSTS,
  ADD_USERPOST,
  UPDATE_BIN,
  DELETE_POST,
};
