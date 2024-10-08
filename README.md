# Finance-App

Finance-App is a comprehensive personal finance management application that helps users track expenses, manage budgets, and achieve their financial goals. This project consists of a React-based frontend and a Node.js backend with GraphQL API.

## Features

- Expense tracking and categorization
- Budget planning and monitoring
- Investment portfolio management
- Financial insights and reports
- Secure bank account integration via Plaid
- User authentication with JWT and Google OAuth
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- React
- Apollo Client for GraphQL
- Material-UI for styling
- Chart.js for data visualization
- React Router for navigation

### Backend
- Node.js
- Express.js
- GraphQL (Apollo Server)
- Sequelize ORM
- PostgreSQL
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Joi for input validation
- Stripe for payment processing
- Nodemailer for email services
- Winston for logging
- Plaid for bank account integration

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL
- Docker
- Docker Compose
- Plaid account (for bank integration)
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd finance-app
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `server` directory based on the `.env.example` file
   - Create a `.env` file in the `client` directory based on the `.env.example` file

4. Build and start the application using Docker:
   ```
   docker-compose up --build
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the application.

## Project Structure

- `client/`: React frontend application
  - `src/`: Source files for the React app
    - `components/`: Reusable React components
    - `pages/`: Main page components
    - `graphql/`: GraphQL queries and mutations
    - `context/`: React context providers
    - `styles/`: Global styles and theme configuration
- `server/`: Node.js backend application
  - `config/`: Configuration files
  - `graphql/`: GraphQL schema and resolvers
  - `models/`: Sequelize model definitions
  - `services/`: Business logic and external API integrations
  - `utils/`: Utility functions and helpers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [Plaid](https://plaid.com/) for bank account integration
- [Stripe](https://stripe.com/) for payment processing
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Material-UI](https://material-ui.com/) for UI components
