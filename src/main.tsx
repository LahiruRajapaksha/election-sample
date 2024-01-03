import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import Login from './Login.tsx';
import OfficerDashboard from './OfficerDashboard.tsx';
import OfficerLogin from './OfficerLogin.tsx';
import VoterDashboard from './VoterDashboard.tsx';
import VoterRegistration from './VoterRegistration.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/voter-registration" element={<VoterRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/voter-dashboard" element={<VoterDashboard />} />
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        <Route path="/officer-login" element={<OfficerLogin />} /> 
      </Routes>
    </BrowserRouter>
    </React.StrictMode>,
)
