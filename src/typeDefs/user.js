import { gql } from "apollo-server-express";

export default gql`
  type Query {
    me: User @auth
    user(id: ID!): User @auth
    users: [User!]! @auth
  }

  type Mutation {
    signUp(
      email: String!
      username: String!
      name: String!
      password: String!
    ): User @guest
    signIn(email: String!, password: String!): User @guest
    signOut: Boolean @auth
  }

  type User {
    id: ID!
    email: String!
    username: String!
    name: String!
    chats: [Chat!]!
    createdAt: String!
  }
`;
