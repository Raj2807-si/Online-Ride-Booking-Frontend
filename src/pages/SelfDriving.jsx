import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SelfDriving = () => {
  const { token, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles/all');
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles', error);
      setLoading(false);
    }
  };

  const handleBook = async (vehicleId) => {
    try {
      await axios.post('http://localhost:5000/api/vehicles/book', {
        vehicleId,
        duration: 1,
        durationType: 'daily'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Vehicle booked successfully! Check your email for more details.');
      fetchVehicles(); // Refresh list
    } catch (error) {
       alert(error.response?.data?.message || 'Error booking vehicle');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Self-Driving Rentals</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Book your vehicle and drive yourself. (Categories: Bike, Car, EV)</p>
      
      {loading ? <p>Loading vehicles...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {vehicles.length === 0 ? <p>No vehicles available at the moment.</p> : vehicles.map(v => (
            <div key={v._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                {v.category === 'bike' ? '🏍️' : v.category === 'ev' ? '⚡' : ''}
              </div>
              <h3 style={{ marginBottom: '5px' }}>{v.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>Category: {v.category.toUpperCase()} | Type: {v.vehicleType.toUpperCase()}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hourly Rate</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>₹{v.hourlyRate}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Rate</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>₹{v.dailyRate}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleBook(v._id)} 
                className="btn-primary" 
                style={{ marginTop: 'auto' }}
              >
                Rent This Vehicle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelfDriving;
