import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import { LogOut, Navigation, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import debounce from 'lodash.debounce';
import RideHistory from '../components/RideHistory';

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  
  const [pSuggestions, setPSuggestions] = useState([]);
  const [dSuggestions, setDSuggestions] = useState([]);
  
  const [vehicleType, setVehicleType] = useState('car');
  const [isBooking, setIsBooking] = useState(false);
  const [socket, setSocket] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentPhase, setPaymentPhase] = useState(false);
  const [completedRide, setCompletedRide] = useState(null);
  const [showUPI, setShowUPI] = useState(false);
  const [history, setHistory] = useState([]);
  const [ratingPhase, setRatingPhase] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/rides/history/rider`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) { console.error('Error fetching history', err); }
    };
    
    useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchHistory();

    const newSocket = io(`${API_BASE_URL}`, {
       auth: { token }
    });
    setSocket(newSocket);

    newSocket.on(`ride_accepted_${user?.id}`, (ride) => {
        setActiveRide(ride);
        alert('Driver accepted your ride!');
    });

    newSocket.on(`ride_started_${user?.id}`, (ride) => {
        setActiveRide(ride);
        alert('Ride started! Enjoy your trip.');
    });

    newSocket.on(`ride_completed_${user?.id}`, (ride) => {
        setActiveRide(null);
        setDriverLocation(null);
        setCompletedRide(ride);
        setPaymentPhase(true);
    });

    newSocket.on('driver_location_update', (data) => {
        // Only update if it matches our active ride's driver
        if (activeRide && data.driverId === activeRide.captain) {
            setDriverLocation({ lat: data.lat, lng: data.lng });
        }
    });

    fetchHistory();

    return () => newSocket.disconnect();
  }, [navigate, token, user, activeRide]);

  const searchAddress = debounce(async (query, type) => {
    if (query.length < 3) return;
    // Clear other suggestions to avoid overlap
    if (type === 'pickup') setDSuggestions([]);
    else setPSuggestions([]);
    
    try {
        const response = await axios.get(`${API_BASE_URL}/api/rides/geocode?q=${encodeURIComponent(query)}&limit=5`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (type === 'pickup') setPSuggestions(response.data);
        else setDSuggestions(response.data);
    } catch (err) { console.error('Geocoding error', err); }
  }, 500);

  const handleBookRide = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    let pCoords = pickupCoords;
    let dCoords = destinationCoords;
    let pName = pickup;
    let dName = destination;

    // Helper to geocode if coordinates are missing
    const getCoords = async (query, suggestions) => {
        if (suggestions && suggestions.length > 0) {
            const first = suggestions[0];
            return { lat: parseFloat(first.lat), lng: parseFloat(first.lon), name: first.display_name };
        }
        try {
            const res = await axios.get(`${API_BASE_URL}/api/rides/geocode?q=${encodeURIComponent(query)}&limit=1`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.length > 0) {
                return { lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon), name: res.data[0].display_name };
            }
        } catch (err) { console.error('Auto-geocoding failed', err); }
        return null;
    };

    setIsBooking(true);

    if (!pCoords && pickup) {
        const result = await getCoords(pickup, pSuggestions);
        if (result) {
            pCoords = { lat: result.lat, lng: result.lng };
            pName = result.name;
            setPickup(result.name);
            setPickupCoords(pCoords);
        }
    }

    if (!dCoords && destination) {
        const result = await getCoords(destination, dSuggestions);
        if (result) {
            dCoords = { lat: result.lat, lng: result.lng };
            dName = result.name;
            setDestination(result.name);
            setDestinationCoords(dCoords);
        }
    }

    if (!pCoords || !dCoords) {
        setErrorMessage('Could not find those locations. Please try again or select from the suggestions.');
        setIsBooking(false);
        return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/api/rides/create`, {
        pickup: pName,
        pickupCoords: pCoords,
        destination: dName,
        destinationCoords: dCoords,
        vehicleType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`${vehicleType.toUpperCase()} request sent! Finding nearest driver... `);
      setIsBooking(false);
      setPickup('');
      setDestination('');
      setPickupCoords(null);
      setDestinationCoords(null);
    } catch (err) {
       const msg = err.response?.data?.message || err.message || 'Error booking ride';
       setErrorMessage(msg);
       setIsBooking(false);
    }
  };

  const handleProcessPayment = async (method) => {
    try {
      await axios.post(`${API_BASE_URL}/api/rides/process-payment`, {
        rideId: completedRide._id,
        paymentMethod: method
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Payment Successful!');
      setPaymentPhase(false);
      setRatingPhase(true); // Transition to rating
      fetchHistory();
    } catch (err) {
      alert('Payment Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
        alert('Please select a star rating first.');
        return;
    }
    try {
        await axios.post(`${API_BASE_URL}/api/rides/rate/${completedRide._id}`, {
            rating,
            feedback
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('Thank you for your feedback!');
        setRatingPhase(false);
        setCompletedRide(null);
        setRating(0);
        setFeedback('');
        fetchHistory();
    } catch (err) {
        console.error('Error submitting rating', err);
        alert('Failed to submit rating.');
    }
  };

  return (
    <div className="map-container">
      {/* Absolute Header */}
      <div className="u-container" style={{ position: 'absolute', top: 20, left: 0, right: 0, zIndex: 1000 }}>
        <div className="u-flex-between u-stack-mobile u-no-gap-mobile" style={{ gap: '15px' }}>
          <h1 style={{ color: 'var(--primary)', textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontSize: '1.5rem', fontWeight: 'bold' }}>Tripzo</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => navigate('/wallet')} className="glass-panel" style={{ border: 'none', padding: '10px 18px', color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                  ₹{user?.walletBalance || 0}
              </button>
              <button onClick={() => { logout(); navigate('/login'); }} className="glass-panel" style={{ border: 'none', padding: '10px 18px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                  <LogOut size={16} /> <span className="u-hide-mobile">Logout</span>
              </button>
          </div>
        </div>
      </div>

      <Map 
        pickup={activeRide?.pickupCoords || pickupCoords} 
        destination={activeRide?.destinationCoords || destinationCoords} 
        driver={driverLocation}
      />

      {paymentPhase && completedRide ? (
        <div className="booking-panel glass-panel" style={{ border: '2px solid var(--primary)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1.4rem' }}>Ride Completed!</h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', marginBottom: '15px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TOTAL FARE</p>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>₹{completedRide.fare}</h2>
            </div>
            
            <p style={{ marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select Payment Method:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => handleProcessPayment('wallet')} 
                  className="btn-primary" 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px' }}
                >
                    <span style={{ fontWeight: '600' }}>Wallet</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Balance: ₹{user?.walletBalance || 0}</span>
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setShowUPI(true)} 
                        className="glass-panel" 
                        style={{ flex: 1, color: '#3b82f6', padding: '14px', border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                    >
                        UPI
                    </button>
                    <button 
                        onClick={() => handleProcessPayment('cash')} 
                        className="glass-panel" 
                        style={{ flex: 1, color: 'white', padding: '14px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                    >
                        Cash
                    </button>
                </div>

                {showUPI && (
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '15px', textAlign: 'center', marginTop: '10px', animation: 'slideDown 0.3s ease' }}>
                        <p style={{ color: '#3b82f6', fontSize: '0.75rem', marginBottom: '10px' }}>Scan the QR code to pay ₹{completedRide.fare}</p>
                        <div style={{ width: '150px', height: '150px', background: 'white', margin: '0 auto 12px', padding: '8px', borderRadius: '10px' }}>
                           <img 
                             src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=9006145808-3@ybl&pn=Tripzo&am=${completedRide.fare}&cu=INR`)}`} 
                             alt="UPI QR Code" 
                             style={{ width: '100%', height: '100%' }}
                           />
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px' }}>UPI ID: <strong>9006145808-3@ybl</strong></p>
                        <button 
                            onClick={() => handleProcessPayment('upi')} 
                            className="btn-primary" 
                            style={{ background: '#3b82f6', border: 'none', width: '100%', padding: '12px' }}
                        >
                            Confirm Payment
                        </button>
                        <button 
                            onClick={() => setShowUPI(false)} 
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
      ) : activeRide ? (
        <div className="booking-panel glass-panel" style={{ border: '1px solid var(--primary)' }}>
            <h3 style={{ marginBottom: '12px', color: 'var(--primary)', fontSize: '1.2rem' }}>Ride In Progress</h3>
            <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</p>
                <p style={{ fontWeight: 'bold', color: '#4ade80' }}>{activeRide.status.toUpperCase()}</p>
            </div>
            {activeRide.status === 'accepted' && (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SHARE THIS OTP WITH DRIVER</p>
                    <h2 style={{ fontSize: '1.6rem', letterSpacing: '4px', marginTop: '4px' }}>{activeRide.otp}</h2>
                </div>
            )}
            <div style={{ marginTop: '15px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DESTINATION</p>
                <p style={{ fontSize: '0.9rem' }}>{activeRide.destination}</p>
            </div>
        </div>
      ) : (
        <div className="booking-panel glass-panel" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: '600' }}>Book a Ride</h3>
          
          {errorMessage && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontWeight: '500' }}>{errorMessage}</span>
                {errorMessage.toLowerCase().includes('balance') && (
                    <button 
                        onClick={() => navigate('/wallet')} 
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', alignSelf: 'flex-start', fontWeight: 'bold' }}
                    >
                        Top Up Wallet
                    </button>
                )}
            </div>
          )}

          <form onSubmit={handleBookRide}>
            <div className="input-group" style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Pickup Location" 
                value={pickup}
                onChange={(e) => { setPickup(e.target.value); searchAddress(e.target.value, 'pickup'); }}
                required 
              />
              {pSuggestions.length > 0 && (
                  <ul className="glass-panel" style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    zIndex: 2000, 
                    listStyle: 'none', 
                    padding: '8px', 
                    marginTop: '8px', 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                  }}>
                      {pSuggestions.map((s) => (
                          <li key={s.place_id} 
                            onMouseDown={() => { 
                                setPickup(s.display_name); 
                                setPickupCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                                setPSuggestions([]); 
                            }} 
                            style={{ 
                              padding: '12px 14px', 
                              cursor: 'pointer', 
                              borderBottom: '1px solid rgba(255,255,255,0.05)', 
                              fontSize: '0.85rem',
                              borderRadius: '8px',
                              transition: 'background 0.2s ease',
                              marginBottom: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              width: '100%',
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(250, 204, 21, 0.12)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                              <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{s.display_name}</span>
                          </li>
                      ))}
                  </ul>
              )}
            </div>
            <div className="input-group" style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter Destination" 
                value={destination}
                onChange={(e) => { setDestination(e.target.value); searchAddress(e.target.value, 'destination'); }}
                required 
              />
              {dSuggestions.length > 0 && (
                  <ul className="glass-panel" style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    zIndex: 2000, 
                    listStyle: 'none', 
                    padding: '8px', 
                    marginTop: '8px', 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                  }}>
                      {dSuggestions.map((s) => (
                          <li key={s.place_id} 
                            onMouseDown={() => { 
                                setDestination(s.display_name); 
                                setDestinationCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                                setDSuggestions([]); 
                            }} 
                            style={{ 
                              padding: '12px 14px', 
                              cursor: 'pointer', 
                              borderBottom: '1px solid rgba(255,255,255,0.05)', 
                              fontSize: '0.85rem',
                              borderRadius: '8px',
                              transition: 'background 0.2s ease',
                              marginBottom: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              width: '100%',
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(250, 204, 21, 0.12)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                              <Navigation size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{s.display_name}</span>
                          </li>
                      ))}
                  </ul>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div onClick={() => setVehicleType('motorcycle')} className={`glass-panel ${vehicleType === 'motorcycle' ? 'active' : ''}`} style={{ flex: '1 1 80px', padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'motorcycle' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>🏍️ Bike</div>
                <div onClick={() => setVehicleType('auto')} className={`glass-panel ${vehicleType === 'auto' ? 'active' : ''}`} style={{ flex: '1 1 80px', padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'auto' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>🛺 Auto</div>
                <div onClick={() => setVehicleType('car')} className={`glass-panel ${vehicleType === 'car' ? 'active' : ''}`} style={{ flex: '1 1 80px', padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'car' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>🚗 Car</div>
            </div>

            <button type="submit" className="btn-primary" disabled={isBooking} style={{ padding: '15px' }}>
              {isBooking ? 'Finding Nearest Driver...' : 'Request Tripzo'}
            </button>
          </form>

          {/* Persistent Recent Activity Section */}
          <div style={{ marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Recent Activity</h4>
                <button 
                    onClick={() => {
                        const fetchHistory = async () => {
                            try {
                                const res = await axios.get(`${API_BASE_URL}/api/rides/history/rider`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                setHistory(res.data);
                            } catch (err) { console.error('Error fetching history', err); }
                        };
                        fetchHistory();
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                    Refresh
                </button>
             </div>
             <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                <RideHistory rides={history} title={null} />
             </div>
          </div>
        </div>
      )}

      {/* Rating Phase Overlay */}
      {ratingPhase && (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1100,
            width: '95%',
            maxWidth: '380px'
        }}>
            <div className="glass-panel" style={{ padding: '25px', textAlign: 'center', boxShadow: '0 0 50px rgba(0,0,0,0.8)' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Rate Your Trip</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '0.9rem' }}>How was your ride with {completedRide.captain?.fullname?.firstname}?</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star}
                            size={28}
                            fill={rating >= star ? "var(--primary)" : "none"}
                            color={rating >= star ? "var(--primary)" : "var(--text-muted)"}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => setRating(star)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    ))}
                </div>

                <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us more about your experience... (optional)"
                    style={{
                        width: '100%',
                        height: '90px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        padding: '12px',
                        color: 'white',
                        marginBottom: '18px',
                        resize: 'none',
                        fontSize: '0.9rem'
                    }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={handleSubmitRating} className="btn-primary" style={{ padding: '14px' }}>Submit Rating</button>
                    <button 
                        onClick={() => {
                            setRatingPhase(false);
                            setCompletedRide(null);
                        }} 
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>

  );
};

export default Home;
