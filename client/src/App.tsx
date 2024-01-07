import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div>
      <header>
        <Typography variant="h1" gutterBottom sx={{ fontSize: '2.5rem', fontWeight: "bolder" }}> 
          GEVS
        </Typography>
        <nav className="navbar">
          <Button color="inherit" onClick={() => handleNavigation('/login')}>Login</Button>
          <Button color="inherit" onClick={() => handleNavigation('/register')}>Register</Button>
          <Button color="inherit" onClick={() => handleNavigation('/OfficerLogin')}>Election Officer Sign-In</Button>
        </nav>
      </header>
        <main>
          <section>
          <h2 style={{ fontWeight: 'bold' }}>Voter Registration</h2>
            <Typography variant="h5" component="h6" style={{ color: 'black', fontSize: '1rem' }}>
              Register as a voter to participate in the election.
            </Typography>
            <Button 
                variant="contained" 
                size="small" 
                sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}
                onClick={() => handleNavigation('/voter-registration')}>
              Register
            </Button>
          </section>

          <section>
          <h2 style={{ fontWeight: 'bold' }}>VoterLogin</h2>
            <Typography variant="h5" component="h6" style={{ color: 'black', fontSize: '1rem' }}>Login to make your vote. 
            </Typography>
            <Button 
                variant="contained" 
                size="small" 
                sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}
                onClick={() => handleNavigation('/login')}>
                Sign-in
            </Button>
          </section>

          <section>
          <h2 style={{ fontWeight: 'bold' }}>Election Commission Officer Login</h2>
            <Typography variant="h5" component="h6" style={{ color: 'black', fontSize: '1rem' }}>
              Login as an Election Commission Officer to manage the election.  
            </Typography>
            <Button
              variant="contained" 
                size="small" 
                sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}
                onClick={() => handleNavigation('/officer-login')}>
              Log-in
            </Button>
          </section>
        </main>
      </div>
    </>
  )
}

export default App
