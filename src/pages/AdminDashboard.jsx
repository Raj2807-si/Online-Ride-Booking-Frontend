import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { LayoutDashboard, UserCheck, Car, Settings, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { token, role, logout } = useAuth();
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [pendingRentals, setPendingRentals] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fleet, setFleet] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' or 'rentals'
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
        navigate('/login');
        return;
    }
    fetchPendingDrivers();
    fetchPendingRentals();
    fetchFleet();
  }, [role, navigate]);

  const fetchPendingDrivers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/drivers/pending`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPendingDrivers(response.data);
        setLoading(false);
    } catch (err) { console.error('Error fetching drivers', err); setLoading(false); }
  };

  const fetchPendingRentals = async () => {
      try {
          const response = await axios.get(`${API_BASE_URL}/api/vehicles/rentals/pending`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setPendingRentals(response.data);
      } catch (err) { console.error('Error fetching rentals', err); }
  }

  const fetchFleet = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/vehicles/all`);
        setFleet(response.data);
    } catch (err) { console.error('Error fetching fleet', err); }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const vehicleData = Object.fromEntries(formData.entries());
    
    try {
        await axios.post(`${API_BASE_URL}/api/vehicles/add`, {
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
        await axios.post(`${API_BASE_URL}/api/drivers/verify/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('Driver verified!');
        fetchPendingDrivers();
    } catch (err) { alert('Error verifying driver'); }
  };

  const handleApproveRental = async (id) => {
      try {
          await axios.post(`${API_BASE_URL}/api/vehicles/rentals/approve/${id}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert('Rental approved and vehicle released!');
          fetchPendingRentals();
          fetchFleet();
      } catch (error) { alert('Error approving rental'); }
  }

  const handleRejectRental = async (id) => {
      if (!window.confirm('Are you sure you want to reject this rental? The user will be refunded.')) return;
      try {
          await axios.post(`${API_BASE_URL}/api/vehicles/rentals/reject/${id}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert('Rental rejected and user refunded.');
          fetchPendingRentals();
          fetchFleet();
      } catch (error) { alert('Error rejecting rental'); }
  }

  return (
    <div className="dashboard-container u-stack-mobile">
      <div className="sidebar glass-panel">
        <div className="logo" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px' }}>Tripzo Admin</div>
        <nav className="u-hide-mobile">
          <div onClick={() => setActiveTab('drivers')} className={`nav-item ${activeTab === 'drivers' || activeTab === 'rentals' ? 'active' : ''}`} style={{ cursor: 'pointer' }}><LayoutDashboard size={20} /> Overview</div>
          <div className="nav-item"><UserCheck size={20} /> Verifications</div>
          <div className="nav-item"><Car size={20} /> Fleet</div>
          <div className="nav-item"><Settings size={20} /> System</div>
        </nav>
        
        <div style={{ marginTop: 'auto', padding: '10px' }} className="u-hide-mobile">
           <button onClick={() => { logout(); navigate('/'); }} className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        <header className="u-stack-mobile" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <h2 className="u-title-mobile" style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>Management Console</h2>
          <div className="u-hide-mobile">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome, Administrator</span>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-primary u-show-mobile" style={{ width: 'auto', padding: '8px 20px' }}>Logout</button>
        </header>

        <div className="u-grid u-grid-4" style={{ marginBottom: '40px', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Pending Drivers</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>{pendingDrivers.length}</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Pending Rentals</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24' }}>{pendingRentals.length}</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Total Revenue</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹45,200</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Fleet Vehicles</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{fleet.length}</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
                onClick={() => setActiveTab('drivers')}
                style={{ padding: '12px 20px', background: 'none', border: 'none', color: activeTab === 'drivers' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'drivers' ? '2px solid var(--primary)' : 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Driver Verifications ({pendingDrivers.length})
            </button>
            <button 
                onClick={() => setActiveTab('rentals')}
                style={{ padding: '12px 20px', background: 'none', border: 'none', color: activeTab === 'rentals' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'rentals' ? '2px solid var(--primary)' : 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Rental Approvals ({pendingRentals.length})
            </button>
        </div>

        {activeTab === 'drivers' ? (
            <section className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Driver Verification Queue</h3>
                {loading ? <p style={{ textAlign: 'center', padding: '20px' }}>Loading queue...</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {pendingDrivers.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No drivers currently awaiting verification.</p> : pendingDrivers.map(d => (
                            <div key={d._id} className="u-stack-mobile u-flex-between" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', gap: '15px' }}>
                                <div>
                                    <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{d.fullname?.firstname} {d.fullname?.lastname}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.email} • {d.vehicle?.plate || 'No Plate'}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end' }} className="u-full-width-mobile">
                                    {d.documents?.[0] && (
                                        <button onClick={() => setSelectedDoc(d.documents[0].fileId)} className="glass-panel" style={{ fontSize: '0.8rem', padding: '8px 16px', flex: 1, textAlign: 'center' }}>Docs</button>
                                    )}
                                    <button onClick={() => handleVerify(d._id)} className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: '0.8rem', flex: 1 }}>Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        ) : (
            <section className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Vehicle Rental Approval Queue</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pendingRentals.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No pending rentals to approve.</p> : pendingRentals.map(r => (
                        <div key={r._id} className="u-stack-mobile u-flex-between" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', gap: '15px' }}>
                            <div>
                                <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{r.user?.fullname?.firstname} {r.user?.fullname?.lastname}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle: <strong>{r.vehicle?.name}</strong> • Duration: {r.duration} {r.durationType}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px' }}>License: {r.user?.licenseNumber || 'NOT FOUND'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end' }} className="u-full-width-mobile">
                                <button onClick={() => handleApproveRental(r._id)} className="btn-primary" style={{ width: 'auto', padding: '8px 24px', fontSize: '0.85rem', flex: 1 }}>Release Vehicle</button>
                                <button onClick={() => handleRejectRental(r._id)} className="glass-panel" style={{ width: 'auto', padding: '8px 24px', fontSize: '0.85rem', flex: 1, border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        <section className="glass-panel" style={{ padding: '24px' }}>
            <div className="u-flex-between u-stack-mobile" style={{ marginBottom: '24px', gap: '15px' }}>
                <h3 style={{ fontSize: '1.2rem' }}>Fleet Management</h3>
                <button onClick={() => setShowAddVehicle(true)} className="btn-primary" style={{ width: 'auto', padding: '10px 24px', fontSize: '0.9rem' }}>+ Add Vehicle</button>
            </div>
            
            <div className="u-table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                      <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>VEHICLE</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>TYPE</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>PLATE</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>DAILY RATE</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>STATUS</th>
                      </tr>
                  </thead>
                  <tbody>
                      {fleet.length === 0 ? <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles in fleet.</td></tr> : fleet.map(v => (
                          <tr key={v._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '16px', fontWeight: '500' }}>{v.name}</td>
                              <td style={{ padding: '16px', fontSize: '0.9rem' }}>{v.category.toUpperCase()}</td>
                              <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{v.plate}</td>
                              <td style={{ padding: '16px', fontSize: '0.9rem' }}>₹{v.dailyRate}</td>
                              <td style={{ padding: '16px' }}>
                                  <span style={{ padding: '4px 12px', background: (v.status === 'available' || v.status === 'booked') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: (v.status === 'available' || v.status === 'booked') ? '#4ade80' : '#f87171', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                      {v.status.toUpperCase()}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
        </section>

        {/* Mobile Bottom Nav */}
        <div className="u-show-mobile glass-panel" style={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: '70px', 
            zIndex: 1002, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-around',
            borderRadius: '20px 20px 0 0',
            padding: '0 10px',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div onClick={() => setActiveTab('drivers')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'drivers' ? 'var(--primary)' : 'var(--text-muted)' }}>
                <LayoutDashboard size={20} />
                <span style={{ fontSize: '0.7rem' }}>Drivers</span>
            </div>
            <div onClick={() => setActiveTab('rentals')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'rentals' ? 'var(--primary)' : 'var(--text-muted)' }}>
                <Clock size={20} />
                <span style={{ fontSize: '0.7rem' }}>Rentals</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <Car size={20} />
                <span style={{ fontSize: '0.7rem' }}>Fleet</span>
            </div>
        </div>

        {showAddVehicle && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <form onSubmit={handleAddVehicle} className="glass-panel u-full-width-mobile" style={{ position: 'relative', maxWidth: '480px', width: '100%', padding: '32px', animation: 'slideUp 0.3s ease' }}>
                    <h3 style={{ marginBottom: '24px', fontSize: '1.3rem' }}>Add New Fleet Vehicle</h3>
                    <div className="input-group"><input name="name" className="input-field" placeholder="Vehicle Name (e.g. Tesla Model 3)" required /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="u-stack-mobile u-no-gap-mobile">
                      <div className="input-group">
                          <select name="category" className="input-field" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required>
                              <option value="car">Car Category</option>
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
                    </div>
                    <div className="input-group"><input name="plate" className="input-field" placeholder="Plate Number (e.g. UP16-XY-1234)" required /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group"><input name="hourlyRate" className="input-field" placeholder="Hourly ₹" type="number" required /></div>
                        <div className="input-group"><input name="dailyRate" className="input-field" placeholder="Daily ₹" type="number" required /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Vehicle</button>
                        <button type="button" onClick={() => setShowAddVehicle(false)} className="glass-panel" style={{ flex: 1 }}>Cancel</button>
                    </div>
                </form>
            </div>
        )}

        {selectedDoc && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="glass-panel u-full-width-mobile" style={{ position: 'relative', maxWidth: '800px', width: '100%', padding: '24px', animation: 'slideUp 0.3s ease' }}>
                    <button onClick={() => setSelectedDoc(null)} style={{ position: 'absolute', top: '-40px', right: '0', color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>Close [X]</button>
                    <h4 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Driver Documentation</h4>
                    <iframe 
                        src={`${API_BASE_URL}/api/drivers/document/${selectedDoc}`} 
                        style={{ width: '100%', height: 'calc(80vh - 100px)', border: 'none', borderRadius: '12px', background: 'white' }}
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
