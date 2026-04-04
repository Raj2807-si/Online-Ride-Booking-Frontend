import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, Settings, Bell, Power, Navigation2, History } from 'lucide-react';
import RideHistory from '../components/RideHistory';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const data = [
  { name: 'Mon', earnings: 450 },
  { name: 'Tue', earnings: 780 },
  { name: 'Wed', earnings: 520 },
  { name: 'Thu', earnings: 900 },
  { name: 'Fri', earnings: 1100 },
  { name: 'Sat', earnings: 1450 },
  { name: 'Sun', earnings: 1200 },
];

const DriverDashboard = () => {
  const { user, token, role } = useAuth();
  const navigate = useNavigate();
  const [activeRide, setActiveRide] = useState(null);
  const [newRide, setNewRide] = useState(null);
  const [earnings, setEarnings] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const activeRideRef = useRef(activeRide);

  useEffect(() => {
    activeRideRef.current = activeRide;
  }, [activeRide]);

  useEffect(() => {
    if (!token || role !== 'driver') {
      navigate('/login');
      return;
    }

    const fetchEarnings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/drivers/earnings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEarnings(response.data.earnings);
      } catch (err) { console.error('Error fetching earnings', err); }
    };
    
    const fetchHistory = async () => {
      try {
          const res = await axios.get(`${API_BASE_URL}/api/rides/history/captain`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setHistory(res.data);
      } catch (err) { console.error('Error fetching history', err); }
    };

    fetchEarnings();
    fetchHistory();

    const newSocket = io(`${API_BASE_URL}`, { auth: { token } });
    setSocket(newSocket);

    newSocket.on('new_ride_request', (ride) => {
        if (!activeRideRef.current) setNewRide(ride);
    });

    newSocket.on(`payment_confirmed_${user?.id}`, (data) => {
        setPaymentConfirmed(data);
        setTimeout(() => setPaymentConfirmed(null), 5000);
    });

    return () => newSocket.disconnect();
  }, [token, role, navigate]);

  const handleToggleStatus = async () => {
    try {
        const nextStatus = isOnline ? 'inactive' : 'active';
        await axios.post(`${API_BASE_URL}/api/drivers/toggle-status`, { status: nextStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setIsOnline(!isOnline);
    } catch (err) { alert('Error updating status'); }
  };

  const handleAcceptRide = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/rides/accept/${newRide._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setActiveRide(response.data);
        setNewRide(null);
    } catch (err) { alert(err.response?.data?.message || 'Error accepting ride'); }
  };

  const handleStartRide = async (otp) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/rides/start`, { 
            rideId: activeRide._id, 
            otp 
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setActiveRide(response.data.ride);
    } catch (err) { alert(err.response?.data?.message || 'Invalid OTP'); }
  };

  const handleCompleteRide = async () => {
    try {
        await axios.post(`${API_BASE_URL}/api/rides/complete/${activeRide._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setActiveRide(null);
        alert('Ride completed & earnings credited!');
        // Refresh earnings
        const res = await axios.get(`${API_BASE_URL}/api/drivers/earnings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEarnings(res.data.earnings);
    } catch (err) { alert('Error completing ride'); }
  };

  return (
    <div className="dashboard-container u-stack-mobile">
      {/* Sidebar / Top Navigation for Mobile */}
      <div className="sidebar glass-panel">
        <div className="logo" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px' }}>Tripzo</div>
        <nav className="u-hide-mobile">
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div 
            onClick={() => setActiveTab('history')} 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            <History size={20} /> Ride History
          </div>
          <div className="nav-item"><Settings size={20} /> Settings</div>
        </nav>

        <div className="nav-user" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <div style={{ width: '42px', height: '42px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', flexShrink: 0 }}>
             {user?.fullname?.firstname?.[0] || 'D'}
           </div>
           <div className="u-hide-mobile">
             <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>{user?.fullname?.firstname}</div>
             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isOnline ? 'Online' : 'Offline'}</div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="u-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px' }}>
          <h2 className="u-title-mobile" style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>Welcome, {user?.fullname?.firstname}!</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
                onClick={handleToggleStatus}
                className="glass-panel" 
                style={{ 
                    border: isOnline ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.1)', 
                    color: isOnline ? '#4ade80' : 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                }}
            >
              <Power size={18} color={isOnline ? '#4ade80' : '#f87171'} />
              <span className="u-hide-mobile">{isOnline ? 'Go Offline' : 'Go Online'}</span>
              {!isOnline && <span className="u-show-mobile">Go Online</span>}
              {isOnline && <span className="u-show-mobile">Online</span>}
            </button>
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
              <Bell size={20} />
            </div>
          </div>
        </header>

        {paymentConfirmed && (
            <div className="glass-panel" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', color: '#4ade80', padding: '16px', borderRadius: '12px', marginBottom: '32px', textAlign: 'center', animation: 'slideDown 0.3s ease' }}>
                <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: '4px' }}>🎉 Payment Confirmed!</strong>
                <span style={{ fontSize: '0.85rem' }}>The rider paid ₹{paymentConfirmed.amount} via {paymentConfirmed.paymentMethod.toUpperCase()}</span>
            </div>
        )}

        {/* New Ride Request Card (Centered on Mobile) */}
        {newRide && (
            <div className="glass-panel" style={{ 
                position: 'fixed', 
                bottom: '80px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: '90%', 
                maxWidth: '420px', 
                padding: '24px', 
                zIndex: 1100, 
                border: '2px solid var(--primary)', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                animation: 'slideUp 0.3s ease' 
            }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>New Trip Request!</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <p style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{newRide.fare}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{newRide.distance / 1000} km estimate</p>
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>PICKUP</span>{newRide.pickup}</p>
                    </div>
                </div>
                <div className="u-flex" style={{ gap: '12px' }}>
                    <button onClick={handleAcceptRide} className="btn-primary" style={{ flex: 1.5, padding: '14px' }}>Accept Trip</button>
                    <button onClick={() => setNewRide(null)} className="glass-panel" style={{ flex: 1, color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.2)' }}>Reject</button>
                </div>
            </div>
        )}

        {/* Active Ride View */}
        {activeRide ? (
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '32px', border: '1.5px solid var(--primary)' }}>
                <div className="u-flex-between u-stack-mobile" style={{ marginBottom: '24px', gap: '15px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem' }}><Navigation2 size={24} color="var(--primary)" /> {activeRide.status === 'ongoing' ? 'Ongoing Trip' : 'Awaiting OTP'}</h3>
                    <div style={{ padding: '6px 16px', background: activeRide.status === 'ongoing' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)', color: activeRide.status === 'ongoing' ? '#4ade80' : '#fbbf24', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600' }}>
                        {activeRide.status.toUpperCase()}
                    </div>
                </div>
                <div className="u-grid u-grid-2" style={{ gap: '30px' }}>
                    <div>
                        <div style={{ marginBottom: '20px' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>PICKUP LOCATION</p>
                          <p style={{ fontSize: '1rem', fontWeight: '500' }}>{activeRide.pickup}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>DESTINATION</p>
                          <p style={{ fontSize: '1rem', fontWeight: '500' }}>{activeRide.destination}</p>
                        </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
                        {activeRide.status === 'accepted' ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleStartRide(e.target.otp.value);
                            }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center' }}>ENTER RIDER'S OTP</p>
                                <input name="otp" className="input-field" placeholder="000000" style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '8px', marginBottom: '20px', fontWeight: 'bold' }} required />
                                <button type="submit" className="btn-primary" style={{ padding: '14px' }}>Verify & Start Trip</button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Fare</p>
                                    <h2 style={{ fontSize: '2.8rem', fontWeight: '800' }}>₹{activeRide.fare}</h2>
                                </div>
                                <button onClick={handleCompleteRide} className="btn-primary" style={{ padding: '14px' }}>Complete & Collect Fare</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
          /* Stats Grid */
          <div className="u-grid u-grid-3" style={{ marginBottom: '32px', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.85rem' }}>Total Earnings</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>₹{earnings}</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.85rem' }}>Current Status</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: isOnline ? '#4ade80' : '#f87171' }}>{isOnline ? 'Online' : 'Offline'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.85rem' }}>Driver Rating</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>⭐ 4.98</div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' ? (
          <>
          <div className="glass-panel" style={{ height: '320px', padding: '24px', marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '20px', fontSize: '1rem', color: 'var(--text-muted)' }}>Weekly Performance</h4>
              <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={data}>
                      <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                      <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                          itemStyle={{ color: 'var(--primary)' }}
                      />
                      <Area type="monotone" dataKey="earnings" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
          
          <div>
            <div className="u-flex-between" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Recent Trips</h3>
                <button 
                  onClick={() => {
                    const fetchHistory = async () => {
                      try {
                          const res = await axios.get(`${API_BASE_URL}/api/rides/history/captain`, {
                              headers: { Authorization: `Bearer ${token}` }
                          });
                          setHistory(res.data);
                      } catch (err) { console.error('Error fetching history', err); }
                    };
                    fetchHistory();
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                >
                  Refresh Log
                </button>
            </div>
            <RideHistory rides={history.slice(0, 5)} title={null} />
            {history.length > 5 && (
              <button 
                onClick={() => setActiveTab('history')}
                style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', color: 'var(--primary)', marginTop: '16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                View Full History
              </button>
            )}
          </div>
        </>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="u-flex-between" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>All History</h2>
              <button 
                onClick={() => {
                  const fetchHistory = async () => {
                    try {
                        const res = await axios.get(`${API_BASE_URL}/api/rides/history/captain`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setHistory(res.data);
                    } catch (err) { console.error('Error fetching history', err); }
                  };
                  fetchHistory();
                }}
                className="glass-panel"
                style={{ padding: '8px 16px', border: '1px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Sync Data
              </button>
            </div>
            <RideHistory rides={history} title={null} />
          </div>
        )}
      </div>

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
        <div onClick={() => setActiveTab('dashboard')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-muted)' }}>
          <LayoutDashboard size={20} />
          <span style={{ fontSize: '0.7rem' }}>Home</span>
        </div>
        <div onClick={() => setActiveTab('history')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)' }}>
          <History size={20} />
          <span style={{ fontSize: '0.7rem' }}>History</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          <Settings size={20} />
          <span style={{ fontSize: '0.7rem' }}>Setup</span>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
