import "dotenv/config";
import http from "http";
import Redis from "ioredis";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import connectRedis from "connect-redis";
import { ApolloServer } from "apollo-server-express";
const { makeExecutableSchema } = require("@graphql-tools/schema");
import {
  ApolloServerPluginInlineTrace,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { makeDirective } from "./directives";
import {
  DATABASE_URI,
  APP_PORT,
  IN_PROD,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} from "./config";

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeDirective(makeExecutableSchema({ typeDefs, resolvers }));
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginInlineTrace(),
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "request.credentials": "include" },
      }),
      // IN_PROD
      //   ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
      //   : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });
  const RedisStore = connectRedis(session);
  const client = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  });
  const store = new RedisStore({ client });

  app.disable("x-powered-by");
  app.use(
    session({
      store,
      name: SESS_NAME,
      secret: SESS_SECRET,
      resave: true,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: parseInt(SESS_LIFETIME),
        sameSite: true,
        secure: IN_PROD,
      },
    })
  );
  await mongoose.connect(DATABASE_URI);
  await server.start();
  server.applyMiddleware({
    app,
    cors: false,
    // cors: {
    //   credentials: true,
    //   origin: ["http://localhost:4000", "https://studio.apollographql.com"],
    // },
  });
  await new Promise((resolve) =>
    httpServer.listen({ port: APP_PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
