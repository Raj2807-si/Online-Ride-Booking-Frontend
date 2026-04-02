import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import { LogOut, Navigation, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import debounce from 'lodash.debounce';

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
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

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

    return () => newSocket.disconnect();
  }, [navigate, token, user, activeRide]);

  const searchAddress = debounce(async (query, type) => {
    if (query.length < 3) return;
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
      
      alert(`Payment successful via ${method.toUpperCase()}!`);
      setShowUPI(false);
      setPaymentPhase(false);
      setCompletedRide(null);
      // Refresh to update balance view
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="map-container">
      {/* Absolute Header */}
      <div className="u-stack-mobile u-no-gap-mobile" style={{ position: 'absolute', top: 20, left: 20, right: 20, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <h1 style={{ color: 'var(--primary)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: '1.5rem', fontWeight: 'bold' }}>Tripzo</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/wallet')} className="glass-panel" style={{ border: 'none', padding: '10px 15px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>
                ₹{user?.walletBalance || 0}
            </button>
            <button onClick={() => { logout(); navigate('/login'); }} className="glass-panel" style={{ border: 'none', padding: '10px 15px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <LogOut size={16} /> <span className="u-hide-mobile">Logout</span>
            </button>
        </div>
      </div>

      <Map 
        pickup={activeRide?.pickupCoords || pickupCoords} 
        destination={activeRide?.destinationCoords || destinationCoords} 
        driver={driverLocation}
      />

      {paymentPhase && completedRide ? (
        <div className="booking-panel glass-panel" style={{ border: '2px solid var(--primary)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '20px', fontSize: '1.5rem' }}>Ride Completed!</h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>TOTAL FARE</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{completedRide.fare}</h2>
            </div>
            
            <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select Payment Method:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => handleProcessPayment('wallet')} 
                  className="btn-primary" 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}
                >
                    <span style={{ fontWeight: '600' }}>Wallet</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Balance: ₹{user?.walletBalance || 0}</span>
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => setShowUPI(true)} 
                        className="glass-panel" 
                        style={{ flex: 1, color: '#3b82f6', padding: '15px', border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        UPI
                    </button>
                    <button 
                        onClick={() => handleProcessPayment('cash')} 
                        className="glass-panel" 
                        style={{ flex: 1, color: 'white', padding: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cash
                    </button>
                </div>

                {showUPI && (
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '20px', textAlign: 'center', marginTop: '10px', animation: 'fadeIn 0.3s ease' }}>
                        <p style={{ color: '#3b82f6', fontSize: '0.8rem', marginBottom: '10px' }}>Scan the QR code to pay ₹{completedRide.fare}</p>
                        <div style={{ width: '180px', height: '180px', background: 'white', margin: '0 auto 15px', padding: '10px', borderRadius: '12px' }}>
                           <img 
                             src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=9006145808-3@ybl&pn=Tripzo&am=${completedRide.fare}&cu=INR`)}`} 
                             alt="UPI QR Code" 
                             style={{ width: '100%', height: '100%' }}
                           />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '15px' }}>UPI ID: <strong>9006145808-3@ybl</strong></p>
                        <button 
                            onClick={() => handleProcessPayment('upi')} 
                            className="btn-primary" 
                            style={{ background: '#3b82f6', border: 'none', width: '100%' }}
                        >
                            Confirm Payment
                        </button>
                        <button 
                            onClick={() => setShowUPI(false)} 
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', marginTop: '10px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
      ) : activeRide ? (
        <div className="booking-panel glass-panel" style={{ border: '1px solid var(--primary)' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Ride In Progress</h3>
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>STATUS</p>
                <p style={{ fontWeight: 'bold', color: '#4ade80' }}>{activeRide.status.toUpperCase()}</p>
            </div>
            {activeRide.status === 'accepted' && (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SHARE THIS OTP WITH DRIVER</p>
                    <h2 style={{ fontSize: '1.75rem', letterSpacing: '4px' }}>{activeRide.otp}</h2>
                </div>
            )}
            <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DESTINATION</p>
                <p>{activeRide.destination}</p>
            </div>
        </div>
      ) : (
        <div className="booking-panel glass-panel">
          <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: '600' }}>Book a Ride</h3>
          
          {errorMessage && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontWeight: '500' }}>{errorMessage}</span>
                {errorMessage.toLowerCase().includes('balance') && (
                    <button 
                        onClick={() => navigate('/wallet')} 
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', alignSelf: 'flex-start', fontWeight: 'bold' }}
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
                    maxHeight: '240px', 
                    overflowY: 'auto',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}>
                      {pSuggestions.map((s) => (
                          <li key={s.place_id} onClick={() => { 
                              setPickup(s.display_name); 
                              setPickupCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                              setPSuggestions([]); 
                          }} style={{ 
                            padding: '12px 16px', 
                            cursor: 'pointer', 
                            borderBottom: '1px solid rgba(255,255,255,0.05)', 
                            fontSize: '0.9rem',
                            borderRadius: '8px',
                            transition: 'background 0.2s ease',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(250, 204, 21, 0.1)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                              <MapPin size={16} color="var(--primary)" />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.display_name}</span>
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
                    maxHeight: '240px', 
                    overflowY: 'auto',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}>
                      {dSuggestions.map((s) => (
                          <li key={s.place_id} onClick={() => { 
                              setDestination(s.display_name); 
                              setDestinationCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                              setDSuggestions([]); 
                          }} style={{ 
                            padding: '12px 16px', 
                            cursor: 'pointer', 
                            borderBottom: '1px solid rgba(255,255,255,0.05)', 
                            fontSize: '0.9rem',
                            borderRadius: '8px',
                            transition: 'background 0.2s ease',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(250, 204, 21, 0.1)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                              <Navigation size={16} color="var(--primary)" />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.display_name}</span>
                          </li>
                      ))}
                  </ul>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div onClick={() => setVehicleType('motorcycle')} className={`glass-panel ${vehicleType === 'motorcycle' ? 'active' : ''}`} style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'motorcycle' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}>🏍️ Bike</div>
                <div onClick={() => setVehicleType('auto')} className={`glass-panel ${vehicleType === 'auto' ? 'active' : ''}`} style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'auto' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}>🛺 Auto</div>
                <div onClick={() => setVehicleType('car')} className={`glass-panel ${vehicleType === 'car' ? 'active' : ''}`} style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'car' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}>🚗 Car</div>
            </div>

            <button type="submit" className="btn-primary" disabled={isBooking}>
              {isBooking ? 'Finding Nearest Driver...' : 'Request Tripzo'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
