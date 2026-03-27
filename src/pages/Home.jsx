import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const newSocket = io('http://localhost:5000', {
       auth: { token }
    });
    setSocket(newSocket);

    newSocket.on('new_ride_request', (ride) => {
       // just listening
    });

    return () => newSocket.disconnect();
  }, [navigate]);

  const handleBookRide = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    
    try {
      await axios.post('http://localhost:5000/api/rides/create', {
        pickup,
        destination,
        fare: 150,
        distance: 5,
        duration: 900
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Simulate frontend callback handling since it takes time for a captain to accept
      setTimeout(() => {
        alert(`Request Sent! Waiting for Captain...`);
        setIsBooking(false);
        setPickup('');
        setDestination('');
      }, 1500);
    } catch (err) {
       alert(err.response?.data?.message || err.message || 'Error booking ride');
       setIsBooking(false);
    }
  };

  return (
    <div className="map-container">
      {/* Absolute Header */}
      <div style={{ position: 'absolute', top: 20, left: 20, right: 20, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--primary)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: '1.5rem', fontWeight: 'bold' }}>Tripzo</h1>
        <button onClick={() => navigate('/login')} className="glass-panel" style={{ border: 'none', padding: '8px 12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <Map />
      
      <div className="booking-panel glass-panel">
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: '600' }}>Where are you going?</h3>
        <form onSubmit={handleBookRide}>
          <div className="input-group">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Pickup Location" 
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter Destination" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isBooking}>
            {isBooking ? 'Finding Captain...' : 'Request Tripzo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
