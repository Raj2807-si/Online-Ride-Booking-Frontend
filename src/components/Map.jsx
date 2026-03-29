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

  if (!isLoaded) return <div className="glass-panel" style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={13}
      options={{
        disableDefaultUI: true,
        styles: [
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#212121" }]
            },
            {
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#757575" }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{ "color": "#303030" }]
            }
        ]
      }}
    >
      {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />}
      {!directions && pickup && <Marker position={defaultCenter} label="P" />}
    </GoogleMap>
  );
};

export default React.memo(Map);
