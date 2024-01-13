import { BrowserRouter, Route, Routes } from "react-router-dom";
import OfficerDashboard from "./views/OfficerDashBoard/OfficerDashboard.tsx";
import VoterDashboard from "./views/VoterDashBoard/VoterDashboard.tsx";
import Login from "./components/LoginForm/LoginForm.tsx";
import LandingPage from "./views/LandingPage/LandingPage.tsx";
import { AuthContext } from "./Providers/AuthProvider.tsx";
import { useContext } from "react";

function App() {
  const { isAuthenticated, userType } = useContext(AuthContext);
  console.log("isAuthenticated User: ", isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated && userType === "voter" ? (
              <VoterDashboard />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/voter-dashboard"
          element={
            isAuthenticated && userType === "voter" ? (
              <VoterDashboard />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/officer-dashboard"
          element={
            isAuthenticated && userType === "officer" ? (
              <OfficerDashboard />
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
