const { AuthenticationError } = require('apollo-server-express');

exports.authorize = (roles = []) => {
  return (next) => (root, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to perform this action');
    }
    if (roles.length && !roles.includes(context.user.role)) {
      throw new AuthenticationError('You do not have permission to perform this action');
    }
    return next(root, args, context, info);
  };
};