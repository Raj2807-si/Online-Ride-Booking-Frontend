import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  
  // Captain specific fields
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('car');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint = role === 'driver' ? `${API_BASE_URL}/api/drivers/register` : `${API_BASE_URL}/api/users/register`;
      
      let payload = {
        fullname: { firstname, lastname },
        email,
        password
      };

      if (role === 'driver') {
        payload.vehicle = {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: Number(vehicleCapacity),
          vehicleType
        };
      }

      const response = await axios.post(endpoint, payload);
      const userData = role === 'driver' ? response.data.driver : response.data.user;
      const finalRole = userData.role || role;
      login(response.data.token, finalRole, userData);
      
      if (finalRole === 'driver') {
        navigate('/captain-dashboard');
      } else if (finalRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed (is the backend & MongoDB running?)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel" style={{ maxWidth: '480px' }}>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Ride with us as a {role === 'driver' ? 'Captain' : 'Rider'}</p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ opacity: role === 'user' ? 1 : 0.5 }}
            onClick={() => setRole('user')}
          >
            Rider
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ opacity: role === 'driver' ? 1 : 0.5, backgroundColor: role === 'driver' ? 'var(--primary)' : 'var(--bg-card)', color: role === 'driver' ? '#000': '#fff' }}
            onClick={() => setRole('driver')}
          >
            Captain
          </button>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-row">
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">First Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="First" 
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required 
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Last Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Last" 
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {role === 'driver' && (
            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Vehicle Details</h4>
              <div className="form-row">
                <div className="input-group" style={{ flex: 1 }}>
                   <label className="input-label">Color</label>
                   <input type="text" className="input-field" placeholder="Black" value={vehicleColor} onChange={e => setVehicleColor(e.target.value)} required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                   <label className="input-label">Plate#</label>
                   <input type="text" className="input-field" placeholder="ABC-1234" value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)} required />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: '10px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                   <label className="input-label">Capacity</label>
                   <input type="number" className="input-field" placeholder="4" value={vehicleCapacity} onChange={e => setVehicleCapacity(e.target.value)} required min="1"/>
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                   <label className="input-label">Type</label>
                   <select className="input-field" value={vehicleType} onChange={e => setVehicleType(e.target.value)} required style={{ background: 'var(--bg-card)' }}>
                     <option value="car">Car</option>
                     <option value="motorcycle">Motorcycle</option>
                     <option value="auto">Auto Rikshaw</option>
                   </select>
                </div>
              </div>
            </div>
          )}

          {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
