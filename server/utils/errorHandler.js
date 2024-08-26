const { ApolloError } = require('apollo-server-express');

class CustomError extends ApolloError {
  constructor(message, code, additionalProperties = {}) {
    super(message, code);
    Object.assign(this, additionalProperties);
  }
}

module.exports = CustomError;