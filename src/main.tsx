import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './Login.tsx'
import VoterRegistration from './VoterRegistration.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <VoterRegistration/>
    <Login/>
  </React.StrictMode>,
)
