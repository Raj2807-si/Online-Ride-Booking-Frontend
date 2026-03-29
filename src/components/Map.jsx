import React, { useMemo, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

const Map = ({ pickup, destination }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_API_KEY_HERE", // User to replace
    libraries,
  });

  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (isLoaded && pickup && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickup,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, pickup, destination]);

  const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  ];

  if (!isLoaded) return <div className="glass-panel" style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={14}
      options={{
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {directions && (
        <DirectionsRenderer 
            directions={directions} 
            options={{ 
                suppressMarkers: false,
                polylineOptions: {
                    strokeColor: "#4f46e5",
                    strokeWeight: 5,
                    strokeOpacity: 0.8
                }
            }} 
        />
      )}
      
      {/* If no directions, show single marker at center/pickup if possible */}
      {!directions && <Marker position={defaultCenter} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />}
    </GoogleMap>
  );
};

export default React.memo(Map);
