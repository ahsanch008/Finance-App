const { verifyGoogleToken, googleLogin } = require('../services/googleAuthService');

const resolvers = {
  Query: {
    _: () => "This is a placeholder query"
  },
  Mutation: {
    googleLogin: async (_, { token }) => {
      try {
        console.log('Received token in resolver:', token);
        const googleUser = await verifyGoogleToken(token);
        console.log('Google user verified:', googleUser.email);
        const { user, token: authToken } = await googleLogin(googleUser);
        console.log('Google login successful for:', user.email);
        return { token: authToken, user };
      } catch (error) {
        console.error('Google login error in resolver:', error);
        throw new Error('Google authentication failed: ' + error.message);
      }
    },
  },
};

module.exports = resolvers;