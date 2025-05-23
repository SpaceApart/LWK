'use client';

import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';

// Domyślne ikony dla Leaflet (ważne, aby działały markery)
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface UseMapCoordinatesProps {
  initialCoordinates?: { lat: number; lng: number } | null;
  onCoordinatesChange?: (coords: { lat: number; lng: number } | null) => void;
  mapId: string;
}

interface MapCoordinates {
  lat: number;
  lng: number;
}

export const useMapCoordinates = ({
  initialCoordinates,
  onCoordinatesChange,
  mapId,
}: UseMapCoordinatesProps) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<MapCoordinates | null>(initialCoordinates || null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Funkcja do inicjalizacji mapy
  const initializeMap = useCallback(() => {
    if (typeof window !== 'undefined' && document.getElementById(mapId) && !mapRef.current) {
      const mapInstance = L.map(mapId).setView(
        initialCoordinates ? [initialCoordinates.lat, initialCoordinates.lng] : [50.85, 15.75], // Domyślne centrum (np. Karkonosze)
        initialCoordinates ? 13 : 9, // Domyślny zoom
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      mapRef.current = mapInstance;
      setIsMapInitialized(true);

      // Ustawienie początkowego markera, jeśli są współrzędne
      if (initialCoordinates) {
        const marker = L.marker([initialCoordinates.lat, initialCoordinates.lng]).addTo(mapInstance);
        markerRef.current = marker;
      }

      // Obsługa kliknięcia na mapie
      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setSelectedCoords({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const newMarker = L.marker([lat, lng]).addTo(mapInstance);
          markerRef.current = newMarker;
        }

        if (onCoordinatesChange) {
          onCoordinatesChange({ lat, lng });
        }
      });
    }
  }, [mapId, initialCoordinates, onCoordinatesChange]);

  // Efekt do inicjalizacji mapy po zamontowaniu komponentu
  useEffect(() => {
    initializeMap();

    // Czyszczenie mapy przy odmontowywaniu
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initializeMap]);

  // Aktualizacja pozycji markera i widoku mapy, gdy initialCoordinates się zmienią z zewnątrz
  useEffect(() => {
    if (mapRef.current && initialCoordinates) {
      setSelectedCoords(initialCoordinates);
      mapRef.current.setView([initialCoordinates.lat, initialCoordinates.lng], 13);
      if (markerRef.current) {
        markerRef.current.setLatLng([initialCoordinates.lat, initialCoordinates.lng]);
      } else {
        const newMarker = L.marker([initialCoordinates.lat, initialCoordinates.lng]).addTo(mapRef.current);
        markerRef.current = newMarker;
      }
    } else if (mapRef.current && !initialCoordinates && markerRef.current) {
      // Usunięcie markera, jeśli współrzędne zostały usunięte z zewnątrz
      markerRef.current.remove();
      markerRef.current = null;
      setSelectedCoords(null);
    }
  }, [initialCoordinates]);


  const setCoordinates = (coords: { lat: number; lng: number } | null) => {
    setSelectedCoords(coords);
    if (mapRef.current) {
      if (coords) {
        mapRef.current.setView([coords.lat, coords.lng], mapRef.current.getZoom());
        if (markerRef.current) {
          markerRef.current.setLatLng([coords.lat, coords.lng]);
        } else {
          markerRef.current = L.marker([coords.lat, coords.lng]).addTo(mapRef.current);
        }
      } else if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
    if (onCoordinatesChange) {
      onCoordinatesChange(coords);
    }
  };

  return { selectedCoords, setCoordinates, mapRef, isMapInitialized, initializeMap };
}; 