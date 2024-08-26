require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const sequelize = require('./config/database');
const { GeneralError } = require('./utils/errors');
const { verifyToken } = require('./config/auth');
const rateLimiterMiddleware = require('./middlewares/rateLimiter');
const logger = require('./utils/logger');
const schemas = require('./validations/schemas');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello From Finance App');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiterMiddleware);
app.use(cors({
  origin: ['http://localhost:5173', 'https://studio.apollographql.com'],
  credentials: true
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = await verifyToken(token);
    return { user };
  },
  formatError: (error) => {
    logger.error(error);
    return error;
  },
  validationRules: [
    (context) => {
      return {
        VariableDefinition(node, _key, parent, _path, ancestors) {
          const operation = ancestors[ancestors.length - 1];
          if (schemas[operation.name.value]) {
            const { error } = schemas[operation.name.value].validate(
              context.variableValues
            );
            if (error) {
              throw new UserInputError(error.details[0].message);
            }
          }
        },
      };
    },
  ],
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' , cors: false});
}
startApolloServer();

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
});

if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true }).then(() => {
    logger.info('Database synced');
  });
}