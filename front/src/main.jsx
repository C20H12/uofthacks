import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-mb0kvpqdd2pi0ptj.us.auth0.com"
    clientId="UirI5b3iRNpot6Rc3fTfL4lFCteRFX5J"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);

