import { BrowserRouter, Route, Routes } from "react-router-dom";
import OfficerDashboard from "./views/OfficerDashBoard/OfficerDashboard.tsx";
import OfficerLogin from "./OfficerLogin.tsx";
import VoterDashboard from "./views/VoterDashBoard/VoterDashboard.tsx";
import Login from "./components/LoginForm.tsx";
import VoterRegistration from "./components/RegisterForm.tsx";
import LandingPage from "./views/LandingPage/LandingPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/voter-registration" element={<VoterRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/voter-dashboard" element={<VoterDashboard />} />
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        <Route path="/officer-login" element={<OfficerLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
