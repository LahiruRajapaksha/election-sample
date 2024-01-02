import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './Login.tsx'
import OfficerDashboard from './OfficerDashboard.tsx'
import VoterDashboard from './VoterDashboard.tsx'
import VoterRegistration from './VoterRegistration.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <VoterRegistration/>
    <Login/>
    <VoterDashboard/>
    <OfficerDashboard/>
    </React.StrictMode>,
)
