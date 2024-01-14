import { BrowserRouter, Route, Routes } from "react-router-dom";
import OfficerDashboard from "./views/OfficerDashBoard/OfficerDashboard.tsx";
import VoterDashboard from "./views/VoterDashBoard/VoterDashboard.tsx";
import Login from "./components/LoginForm/LoginForm.tsx";
import LandingPage from "./views/LandingPage/LandingPage.tsx";
import { AuthContext } from "./Providers/AuthProvider.tsx";
import { useContext } from "react";

function App() {
  const { userData } = useContext(AuthContext);
  const { userType = "", isAuthenticated } = userData;
  console.log("UserType: ", userType);
  console.log("isAuthenticated: ", isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<LandingPage />} />
        <Route
          path="/voter-dashboard"
          element={
            isAuthenticated && userType === "voter" ? (
              <VoterDashboard />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/officer-dashboard"
          element={
            isAuthenticated && userType === "officer" ? (
              <OfficerDashboard />
            ) : (
              <LandingPage />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
