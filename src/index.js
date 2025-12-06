import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const AUTH0_REDIRECT_URI = process.env.REACT_APP_AUTH0_REDIRECT_URI;
const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: AUTH0_REDIRECT_URI,
          audience: AUTH0_AUDIENCE
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
