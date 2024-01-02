import Typography from '@mui/material/Typography';
import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>

        <header>
        <Typography variant="h1" gutterBottom>
        h1. Heading
      </Typography>
        </header>

        <main>
          <section>
            <h2>Voter Registration</h2>
            <p>Register as a voter to participate in the election.</p>
            <a href=''>Register Now</a>
          </section>

          <section>
            <h2>VoterLogin</h2>
            <p>Login to make your vote.</p>
            <a href=''>Login Now</a>
          </section>

          <section>
            <h2>Election Commission Officer Login</h2>
            <p>Login as an Election Commission Officer to manage the election.</p>
            <a href=''></a>
          </section>
        </main>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite  React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}


export default App
