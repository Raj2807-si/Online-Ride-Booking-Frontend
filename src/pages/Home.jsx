import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import { LogOut, Navigation, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
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
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const newSocket = io('http://localhost:5000', {
       auth: { token }
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [navigate, token]);

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
      await axios.post('http://localhost:5000/api/rides/create', {
        pickup,
        pickupCoords,
        destination,
        destinationCoords,
        vehicleType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTimeout(() => {
        alert(`${vehicleType.toUpperCase()} request sent! Finding nearest driver...`);
        setIsBooking(false);
        setPickup('');
        setDestination('');
        setPickupCoords(null);
        setDestinationCoords(null);
      }, 1500);
    } catch (err) {
       alert(err.response?.data?.message || err.message || 'Error booking ride');
       setIsBooking(false);
    }
  };

  return (
    <div className="map-container">
      {/* Absolute Header */}
      <div style={{ position: 'absolute', top: 20, left: 20, right: 20, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--primary)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: '1.5rem', fontWeight: 'bold' }}>Tripzo</h1>
        <button onClick={() => { logout(); navigate('/login'); }} className="glass-panel" style={{ border: 'none', padding: '10px 20px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <Map pickup={pickupCoords} destination={destinationCoords} />
      
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
    </div>
  );
};

export default Home;
