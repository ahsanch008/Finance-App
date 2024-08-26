const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const fetch = require('node-fetch');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.verifyGoogleToken = async (token) => {
  try {
    console.log('Verifying Google token:', token);
    const ticket = await client.getTokenInfo(token);
    console.log('Google token info:', ticket);
    
    // Fetch user info using the access token
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const userData = await response.json();
    console.log('Google user data:', userData);

    return {
      sub: userData.sub,
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw new Error('Invalid Google token: ' + error.message);
  }
};

exports.googleLogin = async (googleUser) => {
  try {
    console.log('Processing Google login for:', googleUser.email);
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      console.log('New user, creating account:', googleUser.email);
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.sub,
        isEmailVerified: true,
      });
      await user.save();
      console.log('New account created for:', googleUser.email);
    } else {
      console.log('Existing user found:', googleUser.email);
      if (!user.googleId) {
        console.log('Updating existing user with Google ID:', googleUser.email);
        user.googleId = googleUser.sub;
        user.isEmailVerified = true;
        await user.save();
      }
    }

    const token = generateToken(user);
    console.log('JWT token generated for user:', googleUser.email);

    return { user, token };
  } catch (error) {
    console.error('Error in googleLogin:', error);
    throw new Error('Failed to process Google login: ' + error.message);
  }
};