const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # Add a placeholder query if you don't have any queries yet
    _: String
  }

  type Mutation {
    googleLogin(token: String!): AuthPayload!
  }

  # ... other type definitions
`;

module.exports = typeDefs;