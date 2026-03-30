import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wallet from './pages/Wallet';
import SelfDriving from './pages/SelfDriving';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-ride" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/captain-dashboard" element={<DriverDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/self-driving" element={<SelfDriving />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
