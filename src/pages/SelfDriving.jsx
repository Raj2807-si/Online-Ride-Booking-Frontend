import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, Zap, Search, ArrowLeft, Info, Calendar, Clock, MapPin } from 'lucide-react';

const SelfDriving = () => {
  const { token, user, updateUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState('daily');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
    fetchMyRentals();
    if (user?.licenseNumber) {
        setLicenseNumber(user.licenseNumber);
    }
  }, [user]);

  useEffect(() => {
    let filtered = vehicles;
    if (category !== 'all') {
      filtered = filtered.filter(v => v.category === category);
    }
    if (searchQuery) {
      filtered = filtered.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredVehicles(filtered);
  }, [category, searchQuery, vehicles]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vehicles/all`);
      setVehicles(response.data);
      setFilteredVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles', error);
      setLoading(false);
    }
  };

  const fetchMyRentals = async () => {
      if (!token) return;
      try {
          const response = await axios.get(`${API_BASE_URL}/api/vehicles/rentals/rider`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setMyRentals(response.data);
      } catch (error) { console.error('Error fetching rentals', error); }
  };

  const handleSaveLicense = async () => {
      if (!licenseNumber.trim()) {
          alert('Please enter a valid license number.');
          return false;
      }
      try {
          const response = await axios.put(`${API_BASE_URL}/api/users/profile`, { licenseNumber }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          updateUser(response.data.user);
          return true;
      } catch (error) {
          alert('Error saving license: ' + (error.response?.data?.message || error.message));
          return false;
      }
  }

  const handleBook = async () => {
    if (!token) {
        navigate('/login');
        return;
    }

    if (!user.licenseNumber) {
        const saved = await handleSaveLicense();
        if (!saved) return;
    }

    setBookingLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/vehicles/book`, {
        vehicleId: selectedVehicle._id,
        duration,
        durationType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message || 'Booking request sent! Awaiting admin approval.');
      setSelectedVehicle(null);
      fetchVehicles(); 
      fetchMyRentals();
    } catch (error) {
       alert(error.response?.data?.message || 'Error booking vehicle');
    } finally {
        setBookingLoading(false);
    }
  };

  const handleCancelRental = async (id) => {
      if (!window.confirm('Are you sure you want to cancel this booking?')) return;
      try {
          await axios.post(`${API_BASE_URL}/api/vehicles/rentals/cancel/${id}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert('Booking cancelled successfully.');
          fetchMyRentals();
          fetchVehicles();
      } catch (error) { alert(error.response?.data?.message || 'Error cancelling rental'); }
  }

  const calculatePrice = (v) => {
      if (durationType === 'daily') return v.dailyRate * duration;
      return v.hourlyRate * duration;
  };

  const statusStyles = {
      pending: { color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', icon: <Clock size={14} /> },
      active: { color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', icon: <Zap size={14} /> },
      completed: { color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', icon: <MapPin size={14} /> },
      cancelled: { color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', icon: <Info size={14} /> }
  };

  return (
    <div className="map-container" style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <button onClick={() => navigate('/book-ride')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Rent & <span style={{ color: 'var(--primary)' }}>Drive</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Choose from our premium fleet and enjoy the ride on your own terms.</p>
          </div>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: '12px', minWidth: '300px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              style={{ background: 'none', border: 'none', color: 'white', outline: 'none', width: '100%' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
          <button 
            onClick={() => setCategory('all')} 
            className={`glass-panel ${category === 'all' ? 'active' : ''}`}
            style={{ padding: '12px 24px', cursor: 'pointer', border: category === 'all' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', color: category === 'all' ? 'var(--primary)' : 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            All Vehicles
          </button>
          <button 
            onClick={() => setCategory('car')} 
            className={`glass-panel ${category === 'car' ? 'active' : ''}`}
            style={{ padding: '12px 24px', cursor: 'pointer', border: category === 'car' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', color: category === 'car' ? 'var(--primary)' : 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Car size={18} /> Cars
          </button>
          <button 
            onClick={() => setCategory('bike')} 
            className={`glass-panel ${category === 'bike' ? 'active' : ''}`}
            style={{ padding: '12px 24px', cursor: 'pointer', border: category === 'bike' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', color: category === 'bike' ? 'var(--primary)' : 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Bike size={18} /> Bikes
          </button>
          <button 
            onClick={() => setCategory('ev')} 
            className={`glass-panel ${category === 'ev' ? 'active' : ''}`}
            style={{ padding: '12px 24px', cursor: 'pointer', border: category === 'ev' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', color: category === 'ev' ? 'var(--primary)' : 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Zap size={18} /> Electric
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="loader" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Discovering premium fleet...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                {filteredVehicles.length === 0 ? (
                    <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '80px', textAlign: 'center' }}>
                        <Search size={40} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
                        <h3>No vehicles found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search query.</p>
                    </div>
                ) : filteredVehicles.map(v => (
                <div key={v._id} className="glass-panel vehicle-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', position: 'relative' }}>
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img src={v.image || 'https://via.placeholder.com/400x200'} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '6px 12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                        {v.category.toUpperCase()}
                    </div>
                    </div>
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{v.name}</h3>
                        <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> Local</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Info size={12} /> {v.vehicleType.toUpperCase()}</span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                        <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>DAILY</p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>₹{v.dailyRate}</p>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>HOURLY</p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{v.hourlyRate}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setSelectedVehicle(v)} 
                        className="btn-primary" 
                        style={{ marginTop: 'auto', width: '100%', padding: '14px' }}
                    >
                        Rent Now
                    </button>
                    </div>
                </div>
                ))}
            </div>

            {/* My Rentals Section */}
            {myRentals.length > 0 && (
                <section style={{ marginTop: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Clock color="var(--primary)" /> Your Active & Pending Rentals
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {myRentals.map(r => (
                            <div key={r._id} className="glass-panel" style={{ padding: '20px', border: `1px solid ${statusStyles[r.status]?.color || 'rgba(255,255,255,0.1)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <h4 style={{ fontWeight: 'bold' }}>{r.vehicle?.name}</h4>
                                    <div style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '100px', 
                                        fontSize: '0.7rem', 
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: statusStyles[r.status]?.background,
                                        color: statusStyles[r.status]?.color
                                    }}>
                                        {statusStyles[r.status]?.icon} {r.status.toUpperCase()}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>Duration: <strong>{r.duration} {r.durationType}</strong></div>
                                    <div>Cost: <strong>₹{r.totalCost}</strong></div>
                                    <div style={{ gridColumn: '1/-1' }}>Booked on: {new Date(r.createdAt).toLocaleDateString()}</div>
                                </div>
                                {r.status === 'pending' && (
                                    <button 
                                        onClick={() => handleCancelRental(r._id)}
                                        className="glass-panel" 
                                        style={{ width: '100%', marginTop: '15px', padding: '10px', fontSize: '0.85rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                                {r.status === 'active' && (
                                    <button 
                                        onClick={async () => {
                                            try {
                                                await axios.post(`${API_BASE_URL}/api/vehicles/rentals/complete/${r._id}`, {}, {
                                                    headers: { Authorization: `Bearer ${token}` }
                                                });
                                                alert('Rental completed! Thank you.');
                                                fetchMyRentals();
                                                fetchVehicles();
                                            } catch (err) { alert('Error completing rental'); }
                                        }}
                                        className="btn-primary" 
                                        style={{ width: '100%', marginTop: '15px', padding: '10px', fontSize: '0.85rem' }}
                                    >
                                        Complete Rental & Return
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
          </>
        )}
      </div>

      {/* Booking Modal Overlay */}
      {selectedVehicle && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="glass-panel" style={{ maxWidth: '450px', width: '100%', padding: '30px', border: '1.5px solid var(--primary)' }}>
                  <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Confirm Booking</h2>
                    <p style={{ color: 'var(--text-muted)' }}>You are renting <strong>{selectedVehicle.name}</strong></p>
                  </div>

                  {!user.licenseNumber && (
                      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(250, 204, 21, 0.05)', border: '1px dashed var(--primary)', marginBottom: '25px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                            <Info size={14} /> DRIVING LICENSE REQUIRED
                        </label>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Enter Driving license Number" 
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                        />
                      </div>
                  )}

                  <div style={{ marginBottom: '25px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>RENTAL DURATION</label>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                          <button 
                            onClick={() => setDurationType('daily')}
                            className={`glass-panel ${durationType === 'daily' ? 'active' : ''}`}
                            style={{ flex: 1, padding: '12px', border: durationType === 'daily' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: durationType === 'daily' ? 'var(--primary)' : 'white' }}
                          >
                            <Calendar size={18} style={{ marginBottom: '4px' }} />
                            <div style={{ fontSize: '0.8rem' }}>Daily</div>
                          </button>
                          <button 
                            onClick={() => setDurationType('hourly')}
                            className={`glass-panel ${durationType === 'hourly' ? 'active' : ''}`}
                            style={{ flex: 1, padding: '12px', border: durationType === 'hourly' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: durationType === 'hourly' ? 'var(--primary)' : 'white' }}
                          >
                            <Clock size={18} style={{ marginBottom: '4px' }} />
                            <div style={{ fontSize: '0.8rem' }}>Hourly</div>
                          </button>
                      </div>
                      <div className="input-group">
                          <input 
                            type="number" 
                            className="input-field" 
                            min="1" 
                            value={duration} 
                            onChange={(e) => setDuration(parseInt(e.target.value))} 
                            placeholder={`Number of ${durationType === 'daily' ? 'days' : 'hours'}`}
                          />
                      </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', marginBottom: '25px', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>TOTAL ESTIMATE</p>
                      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{calculatePrice(selectedVehicle)}</h2>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Balance: ₹{user?.walletBalance || 0}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={handleBook} disabled={bookingLoading} className="btn-primary" style={{ flex: 2, padding: '16px' }}>
                          {bookingLoading ? 'Processing...' : 'Confirm Rental'}
                      </button>
                      <button onClick={() => setSelectedVehicle(null)} className="glass-panel" style={{ flex: 1, cursor: 'pointer' }}>Cancel</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SelfDriving;
