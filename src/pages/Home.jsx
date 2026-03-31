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
        alert('Ride completed! Thank you for using Tripzo.');
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
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`, {
            headers: { 'User-Agent': 'Tripzo-Ride-Booking' }
        });
        if (type === 'pickup') setPSuggestions(response.data);
        else setDSuggestions(response.data);
    } catch (err) { console.error('Geocoding error', err); }
  }, 500);

  const handleBookRide = async (e) => {
    e.preventDefault();
    if (!pickupCoords || !destinationCoords) {
        alert('Please select valid locations from the suggestions.');
        return;
    }
    setIsBooking(true);
    
    try {
      await axios.post(`${API_BASE_URL}/api/rides/create`, {
        pickup,
        pickupCoords,
        destination,
        destinationCoords,
        vehicleType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`${vehicleType.toUpperCase()} request sent! Finding nearest driver... `);
      setIsBooking(false);
      setPickup('');
      setDestination('');
      // Keep coords for the map until accepted
    } catch (err) {
       alert(err.response?.data?.message || err.message || 'Error booking ride');
       setIsBooking(false);
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

      {activeRide ? (
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
          <form onSubmit={handleBookRide}>
            <div className="input-group">
              <input 
                type="text" 
                className="input-field" 
                placeholder="Pickup Location" 
                value={pickup}
                onChange={(e) => { setPickup(e.target.value); searchAddress(e.target.value, 'pickup'); }}
                required 
              />
              {pSuggestions.length > 0 && (
                  <ul className="glass-panel" style={{ position: 'absolute', width: '100%', zIndex: 10, listStyle: 'none', padding: '10px', marginTop: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                      {pSuggestions.map((s) => (
                          <li key={s.place_id} onClick={() => { 
                              setPickup(s.display_name); 
                              setPickupCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                              setPSuggestions([]); 
                          }} style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                              {s.display_name}
                          </li>
                      ))}
                  </ul>
              )}
            </div>
            <div className="input-group">
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter Destination" 
                value={destination}
                onChange={(e) => { setDestination(e.target.value); searchAddress(e.target.value, 'destination'); }}
                required 
              />
              {dSuggestions.length > 0 && (
                  <ul className="glass-panel" style={{ position: 'absolute', width: '100%', zIndex: 10, listStyle: 'none', padding: '10px', marginTop: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                      {dSuggestions.map((s) => (
                          <li key={s.place_id} onClick={() => { 
                              setDestination(s.display_name); 
                              setDestinationCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                              setDSuggestions([]); 
                          }} style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                              {s.display_name}
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
