import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import { LogOut, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const CaptainDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { token, role } = useAuth();

  useEffect(() => {
    if (!token || role !== 'captain') {
      navigate('/login');
      return;
    }

    const newSocket = io('http://localhost:5000', {
       auth: { token }
    });
    setSocket(newSocket);

    newSocket.on('new_ride_request', (ride) => {
       if (isOnline) {
         setActiveRequest(ride);
       }
    });

    return () => newSocket.disconnect();
  }, [navigate, isOnline]);

  const toggleStatus = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      // Simulate receiving a request soon after going online
      setTimeout(() => {
        setActiveRequest({
          _id: 'RIDE123',
          pickup: 'Connaught Place',
          destination: 'India Gate',
          fare: 150,
          distance: '3 km'
        });
      }, 3000);
    } else {
      setActiveRequest(null);
    }
  };

  const acceptRide = async () => {
    try {
      await axios.post(`http://localhost:5000/api/rides/accept/${activeRequest._id || activeRequest.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Ride accepted! Navigation started.`);
      setActiveRequest(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error accepting ride (is MongoDB running?)');
      setActiveRequest(null);
    }
  };

  return (
    <div className="map-container">
      {/* Admin/online Header */}
      <div style={{ position: 'absolute', top: 20, left: 20, right: 20, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--primary)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: '1.5rem', fontWeight: 'bold' }}>Tripzo Captain</h1>
        <button onClick={() => navigate('/login')} className="glass-panel" style={{ border: 'none', padding: '8px 12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <Map />
      
      {/* Online Toggle */}
      <div style={{ position: 'absolute', top: 80, right: 20, zIndex: 1000 }}>
        <button 
          onClick={toggleStatus}
          className="glass-panel"
          style={{
            padding: '12px 20px',
            border: `2px solid ${isOnline ? 'var(--success)' : 'var(--danger)'}`,
            borderRadius: '24px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            fontWeight: 'bold'
          }}
        >
          <Power size={18} color={isOnline ? 'var(--success)' : 'var(--danger)'} />
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </button>
      </div>

      {/* Ride Request Panel */}
      {activeRequest && (
        <div className="booking-panel glass-panel" style={{ border: '2px solid var(--primary)' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
            New Ride Request
          </h3>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pickup</p>
            <p style={{ fontWeight: '600' }}>{activeRequest.pickup}</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Drop-off</p>
            <p style={{ fontWeight: '600' }}>{activeRequest.destination}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fare</p>
              <p style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>₹{activeRequest.fare}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Est. Distance</p>
              <p style={{ fontWeight: '600' }}>{activeRequest.distance}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={acceptRide}>Accept</button>
            <button className="btn-primary" style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={() => setActiveRequest(null)}>Ignore</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainDashboard;
