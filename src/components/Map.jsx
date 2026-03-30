import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const driverIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854894.png', // Simple car/driver icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

// Component to handle map center and zoom when bounds change
const MapUpdater = ({ pickup, destination, driver }) => {
    const map = useMap();
    
    useEffect(() => {
        if (pickup && destination) {
            const points = [
                [pickup.lat, pickup.lng],
                [destination.lat, destination.lng]
            ];
            if (driver) points.push([driver.lat, driver.lng]);

            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (pickup) {
            map.setView([pickup.lat, pickup.lng], 14);
        }
    }, [pickup, destination, driver, map]);
    
    return null;
};

const Map = ({ pickup, destination, driver }) => {
    const [route, setRoute] = useState(null);
    const defaultCenter = [28.6139, 77.2090]; // Delhi

    useEffect(() => {
        if (pickup && destination) {
            const fetchRoute = async () => {
                try {
                    const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`);
                    const data = await response.json();
                    if (data.code === 'Ok') {
                        // OSRM returns coordinates as [lng, lat], Leaflet needs [lat, lng]
                        const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        setRoute(coords);
                    }
                } catch (err) { console.error('Routing error', err); }
            };
            fetchRoute();
        } else {
            setRoute(null);
        }
    }, [pickup, destination]);

    return (
        <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            style={{ width: '100%', height: '100%', background: '#1a1a1a' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            <MapUpdater pickup={pickup} destination={destination} driver={driver} />

            {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />}
            {destination && <Marker position={[destination.lat, destination.lng]} icon={destinationIcon} />}
            {driver && <Marker position={[driver.lat, driver.lng]} icon={driverIcon} />}
            
            {route && <Polyline positions={route} color="#4f46e5" weight={5} opacity={0.8} />}
        </MapContainer>
    );
};

export default React.memo(Map);
