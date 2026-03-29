import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Map from '../components/Map';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const {
    ready,
    value: pickup,
    suggestions: { status: pStatus, data: pData },
    setValue: setPickup,
    clearSuggestions: clearPSuggestions,
  } = usePlacesAutocomplete();

  const {
    ready: dReady,
    value: destination,
    suggestions: { status: dStatus, data: dData },
    setValue: setDestination,
    clearSuggestions: clearDSuggestions,
  } = usePlacesAutocomplete();

  const [vehicleType, setVehicleType] = useState('car');
  const [fare, setFare] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

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
  }, [navigate]);

  const handleBookRide = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    
    try {
      await axios.post('http://localhost:5000/api/rides/create', {
        pickup,
        destination,
        vehicleType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTimeout(() => {
        alert(`${vehicleType.toUpperCase()} request sent! Finding nearest driver...`);
        setIsBooking(false);
        setPickup('');
        setDestination('');
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
        <button onClick={() => navigate('/login')} className="glass-panel" style={{ border: 'none', padding: '8px 12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <Map pickup={pickup} destination={destination} />
      
      <div className="booking-panel glass-panel">
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: '600' }}>Book a Ride</h3>
        <form onSubmit={handleBookRide}>
          <div className="input-group">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Pickup Location" 
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              disabled={!ready}
              required 
            />
            {pStatus === "OK" && (
                <ul className="glass-panel" style={{ position: 'absolute', width: '100%', zIndex: 10, listStyle: 'none', padding: '10px' }}>
                    {pData.map(({ place_id, description }) => (
                        <li key={place_id} onClick={() => { setPickup(description, false); clearPSuggestions(); }} style={{ padding: '8px', cursor: 'pointer' }}>
                            {description}
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
              onChange={(e) => setDestination(e.target.value)}
              disabled={!dReady}
              required 
            />
            {dStatus === "OK" && (
                <ul className="glass-panel" style={{ position: 'absolute', width: '100%', zIndex: 10, listStyle: 'none', padding: '10px' }}>
                    {dData.map(({ place_id, description }) => (
                        <li key={place_id} onClick={() => { setDestination(description, false); clearDSuggestions(); }} style={{ padding: '8px', cursor: 'pointer' }}>
                            {description}
                        </li>
                    ))}
                </ul>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div 
                onClick={() => setVehicleType('motorcycle')}
                className={`glass-panel vehicle-opt ${vehicleType === 'motorcycle' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'motorcycle' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}
              >
                🏍️ Bike
              </div>
              <div 
                onClick={() => setVehicleType('auto')}
                className={`glass-panel vehicle-opt ${vehicleType === 'auto' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'auto' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}
              >
                🛺 Auto
              </div>
              <div 
                onClick={() => setVehicleType('car')}
                className={`glass-panel vehicle-opt ${vehicleType === 'car' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', border: vehicleType === 'car' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}
              >
                🚗 Car
              </div>
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
