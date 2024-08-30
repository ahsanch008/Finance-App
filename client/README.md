# Finance App Frontend

This is the frontend application for the Finance App, built with React and Vite.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Overview

This frontend application provides a user interface for managing personal finances, including features like transaction tracking, investment portfolio management, budgeting, and integration with Plaid for bank account connections.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Navigate to the client directory: `cd client`
3. Install dependencies: `npm install`
4. Create a `.env` file in the client directory and add necessary environment variables (see [Environment Variables](#environment-variables) section)
5. Start the development server: `npm run dev`

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm run lint`: Runs the linter
- `npm run preview`: Locally preview production build

## Project Structure

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── graphql/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   ├── apolloClient.js
│   ├── index.css
│   └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Key Features

- User authentication (including Google OAuth)
- Dashboard with financial overview
- Transaction management
- Investment portfolio tracking
- Budget creation and monitoring
- Savings goals
- Plaid integration for bank account connections
- Responsive design for mobile and desktop

## Technologies Used

- React
- Vite
- Apollo Client
- Material-UI
- React Router
- React Plaid Link
- Chart.js
- Emotion (for styled components)

## Environment Variables

Create a `.env` file in the client directory with the following variables:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:3000/graphql
```

Note: Never commit your `.env` file to version control.
