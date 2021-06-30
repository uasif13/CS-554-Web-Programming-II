import { gql, UserInputError } from "apollo-server";
import { v4 as uuidv4 } from "uuid";
const { ApolloServer } = require("apollo-server");

const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const typeDefs = gql`
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      const { data } = await axios.get(
        `https://api.unsplash.com/photos?page=${args.pageNum}&client_id=n50MvdK59Ka9XSEoFxhgRaV8q1GeO22-XGJIRasRfNg`
      );

      const images = [];
      data.forEach((photodata) => {
        const image = {
          id: photodata.id,
          url: photodata.urls.regular,
          posterName: photodata.user.name,
          description: photodata.description || photodata.alt_description,
          userPosted: false,
          binned: false,
        };
        images.push(image);
      });
      return images;
    },
    binnedImages: async () => {
      let redisCache: any[] = await client.scanAsync("0");
      redisCache = redisCache[1];
      const images: any[] = [];
      for (const post of redisCache) {
        let redisCacheImage = await client.getAsync(post);
        redisCacheImage = JSON.parse(redisCacheImage);
        if (redisCacheImage.binned) {
          images.push(redisCacheImage);
        }
      }
      return images;
    },
    userPostedImages: async () => {
      let redisCache: any[] = await client.scanAsync("0");
      redisCache = redisCache[1];
      const images: any[] = [];
      for (const post of redisCache) {
        let redisCacheImage = await client.getAsync(post);
        redisCacheImage = JSON.parse(redisCacheImage);
        if (redisCacheImage.userPosted) {
          images.push(redisCacheImage);
        }
      }
      return images;
    },
  },
  Mutation: {
    uploadImage: async (_, args) => {
      const imageID = uuidv4();
      const imagePost = {
        id: imageID,
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: true,
        binned: false,
      };
      await client.setAsync(`${imagePost.id}`, JSON.stringify(imagePost));
      return imagePost;
    },
    updateImage: async (_, args) => {
      let redisLookup: string = await client.getAsync(`${args.id}`);
      async function checkunsplash(id) {
        try {
          const { status } = await axios.get(
            `https://api.unsplash.com/photos/${args.id}?client_id=n50MvdK59Ka9XSEoFxhgRaV8q1GeO22-XGJIRasRfNg`
          );
          return true;
        } catch {
          return false;
        }
      }
      const fromUnsplash: Boolean = await checkunsplash(args.id);
      if (!fromUnsplash && redisLookup === null) {
        throw new UserInputError("ID does not exist on unsplash or redis");
      }
      let image: any;
      if (redisLookup !== null) {
        image = JSON.parse(redisLookup);
      } else {
        const { data } = await axios.get(
          `https://api.unsplash.com/photos/${args.id}?client_id=n50MvdK59Ka9XSEoFxhgRaV8q1GeO22-XGJIRasRfNg`
        );
        image = {
          id: data.id,
          url: data.urls.regular,
          posterName: data.user.name,
          description: data.description || data.alt_description,
          userPosted: false,
          binned: false,
        };
      }
      if (args.url !== undefined) {
        image.url = args.url;
      }
      if (args.posterName !== undefined) {
        image.posterName = args.posterName;
      }
      if (args.description !== undefined) {
        image.description = args.description;
      }
      if (args.userPosted !== undefined) {
        image.userPosted = args.userPosted;
      }
      if (args.binned !== undefined) {
        image.binned = args.binned;
      }
      await client.setAsync(`${image.id}`, JSON.stringify(image));
      if (!image.userPosted && !image.binned) {
        await client.delAsync(`${image.id}`);
      }
      return image;
    },
    deleteImage: async (_, args) => {
      let redisLookup = await client.getAsync(`${args.id}`);
      if (redisLookup === null) {
        throw new UserInputError(
          "User Posted Image Id does not exist in cache"
        );
      }
      redisLookup = JSON.parse(redisLookup);
      if (!redisLookup.userPosted) {
        throw new UserInputError(
          "User Posted Image Id does not exist in cache"
        );
      }
      await client.delAsync(`${args.id}`);
      return redisLookup;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server is ready at ${url}`);
});
