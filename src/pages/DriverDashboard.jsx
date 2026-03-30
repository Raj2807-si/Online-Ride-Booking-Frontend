import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, Settings, Bell, Power, Navigation2 } from 'lucide-react';
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

  useEffect(() => {
    if (!token || role !== 'driver') {
      navigate('/login');
      return;
    }

    const fetchEarnings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/drivers/earnings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEarnings(response.data.earnings);
      } catch (err) { console.error('Error fetching earnings', err); }
    };
    fetchEarnings();

    const newSocket = io('http://localhost:5000', { auth: { token } });
    setSocket(newSocket);

    newSocket.on('new_ride_request', (ride) => {
        if (!activeRide) setNewRide(ride);
    });

    return () => newSocket.disconnect();
  }, [token, role, navigate, activeRide]);

  const handleToggleStatus = async () => {
    try {
        const nextStatus = isOnline ? 'inactive' : 'active';
        await axios.post('http://localhost:5000/api/drivers/toggle-status', { status: nextStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setIsOnline(!isOnline);
    } catch (err) { alert('Error updating status'); }
  };

  const handleAcceptRide = async () => {
    try {
        const response = await axios.post(`http://localhost:5000/api/rides/accept/${newRide._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setActiveRide(response.data);
        setNewRide(null);
    } catch (err) { alert(err.response?.data?.message || 'Error accepting ride'); }
  };

  const handleStartRide = async (otp) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/rides/start`, { 
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
        await axios.post(`http://localhost:5000/api/rides/complete/${activeRide._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setActiveRide(null);
        alert('Ride completed & earnings credited!');
        // Refresh earnings
        const res = await axios.get('http://localhost:5000/api/drivers/earnings', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEarnings(res.data.earnings);
    } catch (err) { alert('Error completing ride'); }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar glass-panel">
        <div className="logo" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px' }}>Tripzo</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="nav-item active"><LayoutDashboard size={20} /> Dashboard</div>
          <div className="nav-item"><MapPin size={20} /> Today's Rides</div>
          <div className="nav-item"><Settings size={20} /> Settings</div>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
             {user?.fullname?.firstname?.[0] || 'D'}
           </div>
           <div>
             <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.fullname?.firstname} {user?.fullname?.lastname}</div>
             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isOnline ? 'Online' : 'Offline'}</div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.75rem' }}>Welcome back, {user?.fullname?.firstname}!</h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
                onClick={handleToggleStatus}
                className="glass-panel" 
                style={{ 
                    border: isOnline ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.1)', 
                    color: isOnline ? '#4ade80' : 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 20px',
                    cursor: 'pointer'
                }}
            >
              <Power size={18} color={isOnline ? '#4ade80' : '#f87171'} />
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px' }}>
              <Bell size={20} />
            </div>
          </div>
        </header>

        {/* New Ride Request Modal */}
        {newRide && (
            <div className="glass-panel" style={{ position: 'fixed', bottom: 20, right: 20, width: '350px', padding: '20px', zIndex: 1000, borderLeft: '5px solid var(--primary)', animation: 'slideIn 0.3s ease' }}>
                <h4 style={{ marginBottom: '10px', color: 'var(--primary)' }}>New Ride Request!</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{newRide.fare}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{newRide.distance / 1000} km</p>
                </div>
                <div style={{ margin: '15px 0' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <MapPin size={16} color="var(--primary)" />
                        <p style={{ fontSize: '0.9rem' }}>{newRide.pickup}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button onClick={handleAcceptRide} className="btn-primary" style={{ flex: 1 }}>Accept</button>
                    <button onClick={() => setNewRide(null)} className="glass-panel" style={{ flex: 1, color: '#f87171' }}>Reject</button>
                </div>
            </div>
        )}

        {/* Active Ride View */}
        {activeRide ? (
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px', border: '1px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Navigation2 size={24} /> {activeRide.status === 'ongoing' ? 'Ride in Progress' : 'Collect OTP to Start'}</h3>
                    <div style={{ padding: '5px 15px', background: activeRide.status === 'ongoing' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: activeRide.status === 'ongoing' ? '#4ade80' : '#fbbf24', borderRadius: '12px', fontSize: '0.8rem' }}>
                        {activeRide.status.toUpperCase()}
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>FROM</p>
                        <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{activeRide.pickup}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TO</p>
                        <p style={{ fontSize: '1.1rem' }}>{activeRide.destination}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {activeRide.status === 'accepted' ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleStartRide(e.target.otp.value);
                            }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>ENTER RIDER OTP</p>
                                <input name="otp" className="input-field" placeholder="123456" style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px', marginBottom: '15px' }} required />
                                <button type="submit" className="btn-primary">Verify & Start Ride</button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fare amount to collect</p>
                                    <h2 style={{ fontSize: '2.5rem' }}>₹{activeRide.fare}</h2>
                                </div>
                                <button onClick={handleCompleteRide} className="btn-primary">Complete & Collect Fare</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
          /* Stats Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Total Earnings</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{earnings}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Status</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isOnline ? '#4ade80' : '#f87171' }}>{isOnline ? 'Online' : 'Offline'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Rating</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>⭐ 4.98</div>
            </div>
          </div>
        )}

        <div className="glass-panel" style={{ height: '300px', padding: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--primary)' }}
                    />
                    <Area type="monotone" dataKey="earnings" stroke="var(--primary)" fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
