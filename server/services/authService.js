const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthenticationError } = require('apollo-server-express');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authService = {
  async verifyGoogleToken(token) {
    try {
      const ticket = await client.getTokenInfo(token);
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
      const userData = await response.json();

      return {
        sub: userData.sub,
        email: userData.email,
        name: userData.name,
        picture: userData.picture
      };
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new AuthenticationError('Invalid Google token');
    }
  },

  async googleAuth(googleUser) {
    try {
      let user = await User.findOne({ where: { email: googleUser.email } });

      if (!user) {
        user = await User.create({
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.sub,
          isEmailVerified: true,
        });
      } else if (!user.googleId) {
        user.googleId = googleUser.sub;
        user.isEmailVerified = true;
        await user.save();
      }

      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      console.error('Error in Google authentication:', error);
      throw new AuthenticationError('Failed to process Google login');
    }
  },

  async register(name, email, password) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AuthenticationError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    return { user, token };
  },

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  },

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  },
};

module.exports = authService;