"use client";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';

interface MapboxSuggestion {
  place_name: string;
  geometry: {
    coordinates: [number, number];
  };
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const LocationPicker = ({ value, path, onChange }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);

  useEffect(() => {
    if (value && value.length === 2 && map) {
      const [lng, lat] = value;
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }
      map.setCenter([lng, lat]);
    }
  }, [value, map]);

  useEffect(() => {
    if (mapContainer.current && !map) {
      const m = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [15.740, 50.899],
        zoom: 12,
      });

      m.on('click', async (e) => {
        const { lng, lat } = e.lngLat;

        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(m);
        }

        onChange({
          path,
          value: [lng, lat],
        });

        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
        const data = await response.json();
        const address = data?.features?.[0]?.place_name || '';
        setQuery(address);
      });

      setMap(m);
    }
  }, [map]);

  const handleSelectSuggestion = (place) => {
    const [lng, lat] = place.center;
    const address = place.place_name;

    if (markerRef.current && map) {
      markerRef.current.setLngLat([lng, lat]);
      map.flyTo({ center: [lng, lat], zoom: 14 });
    } else if (map) {
      markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      map.flyTo({ center: [lng, lat], zoom: 14 });
    }

    onChange({
      path,
      value: [lng, lat],
    });

    setQuery(address);
    setSuggestions([]);
  };

  useEffect(() => {
    if (query.length > 2) {
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => setSuggestions(data.features));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Wpisz adres..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      {suggestions.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '8px', background: '#fff', border: '1px solid #ccc' }}>
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSelectSuggestion(s)}
              style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            >
              {s.place_name}
            </li>
          ))}
        </ul>
      )}
      <div ref={mapContainer} style={{ height: '400px', borderRadius: '8px' }} />
    </div>
  );
};
 
export default LocationPicker;