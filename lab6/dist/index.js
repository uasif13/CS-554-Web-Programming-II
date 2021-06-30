"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const uuid_1 = require("uuid");
const { ApolloServer } = require("apollo-server");
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const typeDefs = apollo_server_1.gql `
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
        unsplashImages: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = yield axios.get(`https://api.unsplash.com/photos?page=${args.pageNum}&client_id=n50MvdK59Ka9XSEoFxhgRaV8q1GeO22-XGJIRasRfNg`);
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
        }),
        binnedImages: () => __awaiter(void 0, void 0, void 0, function* () {
            let redisCache = yield client.scanAsync("0");
            redisCache = redisCache[1];
            const images = [];
            for (const post of redisCache) {
                let redisCacheImage = yield client.getAsync(post);
                redisCacheImage = JSON.parse(redisCacheImage);
                if (redisCacheImage.binned) {
                    images.push(redisCacheImage);
                }
            }
            return images;
        }),
        userPostedImages: () => __awaiter(void 0, void 0, void 0, function* () {
            let redisCache = yield client.scanAsync("0");
            redisCache = redisCache[1];
            const images = [];
            for (const post of redisCache) {
                let redisCacheImage = yield client.getAsync(post);
                redisCacheImage = JSON.parse(redisCacheImage);
                if (redisCacheImage.userPosted) {
                    images.push(redisCacheImage);
                }
            }
            return images;
        }),
    },
    Mutation: {
        uploadImage: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const imageID = uuid_1.v4();
            const imagePost = {
                id: imageID,
                url: args.url,
                posterName: args.posterName,
                description: args.description,
                userPosted: true,
                binned: false,
            };
            yield client.setAsync(`${imagePost.id}`, JSON.stringify(imagePost));
            return imagePost;
        }),
        updateImage: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            let redisLookup = yield client.getAsync(`${args.id}`);
            function checkunsplash(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { status } = yield axios.get(`https://api.unsplash.com/photos/${args.id}?client_id=n50MvdK59Ka9XSEoFxhgRaV8q1GeO22-XGJIRasRfNg`);
                        return true;
                    }
                    catch (_a) {
                        return false;
                    }
                });
            }
            const fromUnsplash = yield checkunsplash(args.id);
            if (!fromUnsplash && redisLookup === null) {
                throw new apollo_server_1.UserInputError("ID does not exist on unsplash or redis");
            }
            let image;
            if (redisLookup !== null) {
                image = JSON.parse(redisLookup);
            }
            else {
                const { data } = yield axios.get(`https://api.unsplash.com/photos/${args.id}?client_id=n50MvdK59Ka9XSEoFxhgRaV8q1GeO22-XGJIRasRfNg`);
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
            yield client.setAsync(`${image.id}`, JSON.stringify(image));
            if (!image.userPosted && !image.binned) {
                yield client.delAsync(`${image.id}`);
            }
            return image;
        }),
        deleteImage: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            let redisLookup = yield client.getAsync(`${args.id}`);
            if (redisLookup === null) {
                throw new apollo_server_1.UserInputError("User Posted Image Id does not exist in cache");
            }
            redisLookup = JSON.parse(redisLookup);
            if (!redisLookup.userPosted) {
                throw new apollo_server_1.UserInputError("User Posted Image Id does not exist in cache");
            }
            yield client.delAsync(`${args.id}`);
            return redisLookup;
        }),
    },
};
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`🚀 Server is ready at ${url}`);
});
