import { useEffect, useRef } from 'react';
import { HazardReport } from '@/types';

interface IndiaMapProps {
  reports: HazardReport[];
}

const IndiaMap = ({ reports }: IndiaMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Fix for default markers
        delete (L.default.Icon.Default.prototype as any)._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map instance
        const map = L.default.map(mapRef.current!).setView([20.5937, 78.9629], 6);

        // Add tile layer
        L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Store map instance
        mapInstanceRef.current = map;

        // Add markers for reports
        reports.forEach((report) => {
          let markerColor = '#3b82f6'; // Default blue
          
          // Color based on source
          if (report.source === 'citizen') markerColor = '#3b82f6'; // Blue
          if (report.source === 'official') markerColor = '#10b981'; // Green
          if (report.source === 'social') markerColor = '#f59e0b'; // Orange
          
          // Color based on severity
          if (report.severity === 'high') markerColor = '#ef4444'; // Red
          if (report.severity === 'critical') markerColor = '#dc2626'; // Dark red

          // Create custom icon
          const customIcon = L.default.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          // Add marker
          const marker = L.default.marker([report.latitude, report.longitude], { icon: customIcon })
            .addTo(map);

          // Add popup
          marker.bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${markerColor};"></div>
                <span style="font-weight: bold; text-transform: capitalize;">${report.type.replace('-', ' ')}</span>
                <span style="padding: 2px 6px; border-radius: 12px; font-size: 10px; background-color: ${
                  report.severity === 'high' ? '#fee2e2' : 
                  report.severity === 'medium' ? '#fef3c7' : 
                  report.severity === 'low' ? '#d1fae5' : '#f3f4f6'
                }; color: ${
                  report.severity === 'high' ? '#dc2626' : 
                  report.severity === 'medium' ? '#d97706' : 
                  report.severity === 'low' ? '#059669' : '#374151'
                };">${report.severity}</span>
              </div>
              <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${report.description}</p>
              <div style="font-size: 10px; color: #6b7280;">
                <p><strong>Location:</strong> ${report.location}</p>
                <p><strong>Reported by:</strong> ${report.userName}</p>
                <p><strong>Source:</strong> ${report.source}</p>
                <p><strong>Status:</strong> ${report.status}</p>
                <p><strong>Time:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
              </div>
            </div>
          `);
        });

      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    loadMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [reports]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    />
  );
};

export default IndiaMap;
