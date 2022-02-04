import { gql } from "apollo-server-core";

export default gql`
  type Message {
    id: ID!
    body: String!
    sender: User!
    createdAt: String!
    updatedAt: String!
  }
`;
