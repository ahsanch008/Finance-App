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

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Stripe account (for payment processing)

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

### Main Queries:

- `me`: Get the current user's information
- `transactions`: Get user transactions
- `investments`: Get user investments
- `savingsGoals`: Get user savings goals
- `budgets`: Get user budgets
- `cards`: Get user payment cards
- `financialSummary`: Get a summary of the user's financial status

### Main Mutations:

- `register`: Register a new user
- `login`: Log in a user
- `createTransaction`: Create a new transaction
- `createInvestment`: Create a new investment
- `createSavingsGoal`: Create a new savings goal
- `createBudget`: Create a new budget
- `addCard`: Add a new payment card
- `createCharge`: Process a payment

For a full list of queries and mutations, refer to the GraphQL schema in:


```3:134:server/graphql/schema.js
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    transactions: [Transaction!]
    investments: [Investment!]
    savingsGoals: [SavingsGoal!]
    budgets: [Budget!]
    cards: [Card!]
  }

  type Transaction {
    id: ID!
    amount: Float!
    category: String!
    description: String
    date: String!
    user: User!
  }

  type Investment {
    id: ID!
    type: String!
    amount: Float!
    date: String!
    currentValue: Float
    user: User!
  }

  type SavingsGoal {
    id: ID!
    name: String!
    targetAmount: Float!
    currentAmount: Float!
    targetDate: String!
    progress: Float!
    user: User!
  }

  type Budget {
    id: ID!
    category: String!
    amount: Float!
    period: String!
    currentSpending: Float!
    remainingAmount: Float!
    user: User!
  }

  type Card {
    id: ID!
    last4: String!
    brand: String!
    user: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type FinancialSummary {
    totalIncome: Float!
    totalExpenses: Float!
    netSavings: Float!
    investmentValue: Float!
  }

  input TransactionInput {
    amount: Float!
    category: String!
    description: String
    date: String
  }

  input InvestmentInput {
    type: String!
    amount: Float!
    date: String
  }

  input SavingsGoalInput {
    name: String!
    targetAmount: Float!
    targetDate: String!
  }

  input BudgetInput {
    category: String!
    amount: Float!
    period: String!
  }

  type Query {
    me: User
    user(id: ID!): User
    transaction(id: ID!): Transaction
    transactions(startDate: String, endDate: String, category: String): [Transaction!]!
    investment(id: ID!): Investment
    investments(startDate: String, endDate: String, type: String): [Investment!]!
    savingsGoal(id: ID!): SavingsGoal
    savingsGoals: [SavingsGoal!]!
    budget(id: ID!): Budget
    budgets: [Budget!]!
    card(id: ID!): Card
    cards: [Card!]!
    financialSummary(startDate: String, endDate: String): FinancialSummary!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(name: String, email: String, password: String): User!
    createTransaction(input: TransactionInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
    createInvestment(input: InvestmentInput!): Investment!
    updateInvestment(id: ID!, input: InvestmentInput!): Investment!
    deleteInvestment(id: ID!): Boolean!
    createSavingsGoal(input: SavingsGoalInput!): SavingsGoal!
    updateSavingsGoal(id: ID!, input: SavingsGoalInput!): SavingsGoal!
    deleteSavingsGoal(id: ID!): Boolean!
    createBudget(input: BudgetInput!): Budget!
    updateBudget(id: ID!, input: BudgetInput!): Budget!
    deleteBudget(id: ID!): Boolean!
    addCard(token: String!): Card!
    deleteCard(id: ID!): Boolean!
    createCharge(amount: Float!, currency: String!, cardId: ID!): Boolean!
  }
`;
```


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

