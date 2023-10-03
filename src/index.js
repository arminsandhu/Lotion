

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider }  from '@react-oauth/google';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="256412061344-jv6bmjpo2sgav43qj70tpct9rjo8dqpr.apps.googleusercontent.com">
            
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/notes" />} />
          <Route path="/notes/:id" element={<App />} />
          <Route path="/notes/:id/edit" element={<App />} />
          <Route path={"/notes"} element={<App />}/>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>

  </GoogleOAuthProvider>
  
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();