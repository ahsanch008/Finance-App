# Finance App Backend

## Description

This is the backend server for a comprehensive personal finance management application. It provides a GraphQL API for managing user accounts, transactions, investments, savings goals, budgets, and payment processing.

## Technologies Used

- Node.js
- Express.js
- Apollo Server (GraphQL)
- Sequelize ORM
- PostgreSQL
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Joi for input validation
- Stripe for payment processing
- Nodemailer for email services
- Winston for logging
- Plaid for bank account integration

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Stripe account (for payment processing)
- Plaid account (for bank account integration)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd finance-app-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=3000
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   ```

4. Set up the database:
   - Create a PostgreSQL database with the name specified in your `.env` file.
   - The tables will be automatically created when you run the server in development mode.

## Running the Server

To start the server in development mode:

```
npm run dev
```

For production:

```
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Documentation

The GraphQL API is available at `/graphql`. You can use tools like GraphQL Playground or Apollo Studio to explore and test the API.

### Main Queries and Mutations:

For a full list of queries and mutations, refer to the GraphQL schema in:

server/graphql/schema.js

## Authentication

The API uses JWT for authentication. To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Error Handling

The application uses custom error classes for consistent error responses. Errors are logged using Winston.

## Data Validation

Input data is validated using Joi. Validation schemas can be found in the `validations` directory.

## Database

The application uses Sequelize ORM with PostgreSQL. Model definitions can be found in the `models` directory.

## Services

Business logic is organized into service modules in the `services` directory. These include:

- `authService`: Handles user registration and login
- `transactionService`: Manages financial transactions
- `investmentService`: Handles investment-related operations
- `savingsGoalService`: Manages savings goals
- `budgetService`: Handles budget-related operations
- `cardService`: Manages payment cards
- `paymentService`: Processes payments using Stripe
- `emailService`: Sends emails using Nodemailer
- `plaidService`: Handles Plaid integration for bank account linking

## Security

- Rate limiting is implemented to prevent abuse of the API.
- Passwords are hashed using bcrypt before storage.
- Environment variables are used for sensitive information.

## Additional Features

- Google OAuth integration for user authentication
- Plaid integration for bank account linking and transaction fetching
- Monthly and annual financial reports generation

For more details on specific components or services, refer to the corresponding files in the codebase.
```