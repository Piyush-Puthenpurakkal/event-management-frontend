import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useContext } from "react";
import AuthContext from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Sidebar from "./components/Sidebar";
import AddEvent from "./pages/AddEvent";

// Pages
import Home from "./pages/Home";
import AuthStart from "./pages/AuthStart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutYourself from "./pages/AboutYourself";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import Availability from "./pages/Availability";
import Booking from "./pages/Booking";

const App = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Home />}
        />

        <Route path="/home" element={<Home />} />
        <Route path="/auth-start" element={<AuthStart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/about-yourself"
          element={
            <ProtectedRoute>
              <AboutYourself />
            </ProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div
                className={`app-layout ${
                  isSidebarOpen ? "sidebar-open" : "sidebar-closed"
                }`}
              >
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="main-content">
                  <div className="page-container">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="events" element={<Events />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="add-event" element={<AddEvent />} />
                      <Route path="availability" element={<Availability />} />
                      <Route path="booking" element={<Booking />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
