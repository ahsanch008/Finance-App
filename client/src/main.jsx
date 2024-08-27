import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css'; // If you have any global styles
import client from './apolloClient';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <GoogleOAuthProvider clientId="31404322021-19hfk7j8i8u4hu0a5m0f77cgsdojvu49.apps.googleusercontent.com">
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);