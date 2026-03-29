import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, UserCheck, Car, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fleet, setFleet] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingDrivers();
    fetchFleet();
  }, []);

  const fetchPendingDrivers = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/drivers/pending', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPendingDrivers(response.data);
        setLoading(false);
    } catch (err) { console.error('Error fetching drivers', err); setLoading(false); }
  };

  const fetchFleet = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/vehicles/all');
        setFleet(response.data);
    } catch (err) { console.error('Error fetching fleet', err); }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const vehicleData = Object.fromEntries(formData.entries());
    
    try {
        await axios.post('http://localhost:5000/api/vehicles/add', {
            ...vehicleData,
            hourlyRate: Number(vehicleData.hourlyRate),
            dailyRate: Number(vehicleData.dailyRate)
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('Vehicle added to fleet!');
        setShowAddVehicle(false);
        fetchFleet();
    } catch (err) { alert('Error adding vehicle'); }
  };

  const handleVerify = async (id) => {
    try {
        await axios.post(`http://localhost:5000/api/drivers/verify/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('Driver verified!');
        fetchPendingDrivers();
    } catch (err) { alert('Error verifying driver'); }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar glass-panel">
        <div className="logo" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px' }}>Tripzo Admin</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="nav-item active"><LayoutDashboard size={20} /> Overview</div>
          <div className="nav-item"><UserCheck size={20} /> Verifications</div>
          <div className="nav-item"><Car size={20} /> Fleet</div>
          <div className="nav-item"><Settings size={20} /> System</div>
        </nav>
      </div>

      <div className="main-content">
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.75rem' }}>Management Console</h2>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-primary" style={{ width: 'auto' }}>Logout</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending Drivers</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingDrivers.length}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Active Rides</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹45,200</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Fleet Status</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{fleet.length} Active</div>
          </div>
        </div>

        <section className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Driver Verification Queue</h3>
            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {pendingDrivers.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No drivers currently awaiting verification.</p> : pendingDrivers.map(d => (
                        <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <p style={{ fontWeight: '600' }}>{d.fullname}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.email} | Vehicle: {d.vehicle?.plate || 'N/A'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {d.documents?.[0] && (
                                    <button onClick={() => setSelectedDoc(d.documents[0].fileId)} className="glass-panel" style={{ fontSize: '0.8rem' }}>View Docs</button>
                                )}
                                <button onClick={() => handleVerify(d._id)} className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: '0.8rem' }}>Approve</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        <section className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Vehicle Fleet Management</h3>
                <button onClick={() => setShowAddVehicle(true)} className="btn-primary" style={{ width: 'auto', padding: '8px 20px' }}>+ Add Vehicle</button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '15px' }}>Vehicle Name</th>
                        <th style={{ padding: '15px' }}>Type</th>
                        <th style={{ padding: '15px' }}>Plate</th>
                        <th style={{ padding: '15px' }}>Daily Rate</th>
                        <th style={{ padding: '15px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {fleet.length === 0 ? <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles in fleet.</td></tr> : fleet.map(v => (
                        <tr key={v._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px' }}>{v.name}</td>
                            <td style={{ padding: '15px' }}>{v.category.toUpperCase()}</td>
                            <td style={{ padding: '15px' }}>{v.plate}</td>
                            <td style={{ padding: '15px' }}>₹{v.dailyRate}</td>
                            <td style={{ padding: '15px' }}>
                                <span style={{ padding: '4px 12px', background: v.status === 'available' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: v.status === 'available' ? '#4ade80' : '#f87171', borderRadius: '12px', fontSize: '0.75rem' }}>
                                    {v.status.toUpperCase()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>

        {showAddVehicle && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <form onSubmit={handleAddVehicle} className="glass-panel" style={{ position: 'relative', maxWidth: '500px', width: '100%', padding: '30px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Add New Fleet Vehicle</h3>
                    <div className="input-group"><input name="name" className="input-field" placeholder="Vehicle Name (e.g. Tesla Model 3)" required /></div>
                    <div className="input-group">
                        <select name="category" className="input-field" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required>
                            <option value="car">Car</option>
                            <option value="ev">EV</option>
                            <option value="bike">Bike</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <select name="vehicleType" className="input-field" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="mini">Mini</option>
                            <option value="motorcycle">Motorcycle</option>
                        </select>
                    </div>
                    <div className="input-group"><input name="plate" className="input-field" placeholder="Plate Number" required /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group"><input name="hourlyRate" className="input-field" placeholder="Hourly ₹" type="number" required /></div>
                        <div className="input-group"><input name="dailyRate" className="input-field" placeholder="Daily ₹" type="number" required /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button type="submit" className="btn-primary">Add Vehicle</button>
                        <button type="button" onClick={() => setShowAddVehicle(false)} className="glass-panel">Cancel</button>
                    </div>
                </form>
            </div>
        )}

        {selectedDoc && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div className="glass-panel" style={{ position: 'relative', maxWidth: '800px', width: '100%', padding: '20px' }}>
                    <button onClick={() => setSelectedDoc(null)} style={{ position: 'absolute', top: -40, right: 0, color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>Close</button>
                    <h4 style={{ marginBottom: '20px' }}>Document Viewer</h4>
                    <iframe 
                        src={`http://localhost:5000/api/drivers/document/${selectedDoc}`} 
                        style={{ width: '100%', height: '500px', border: 'none', borderRadius: '12px', background: 'white' }}
                        title="Document"
                    />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
