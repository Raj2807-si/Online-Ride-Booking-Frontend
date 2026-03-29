import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>Admin Dashboard</h2>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-primary" style={{ width: 'auto' }}>Logout</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>0</p>
          </div>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Active Drivers</h3>
            <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>0</p>
          </div>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Total Rides</h3>
            <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>0</p>
          </div>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Revenue</h3>
            <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>₹0</p>
          </div>
        </div>

        <h3>System Overview</h3>
        <p style={{ color: 'var(--text-muted)' }}>Monitoring and management tools will appear here in the next update.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
