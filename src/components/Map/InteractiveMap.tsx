import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HazardReport, MapHotspot } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Clock, User, Camera } from 'lucide-react';
import { format } from 'date-fns';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different hazard types
const createHazardIcon = (type: HazardReport['type'], severity: HazardReport['severity']) => {
  const colors = {
    'tsunami': '#ef4444',
    'high-waves': '#f59e0b',
    'storm-surge': '#3b82f6',
    'coastal-damage': '#10b981',
    'unusual-tides': '#8b5cf6',
    'swell-surge': '#06b6d4',
  };

  const sizes = {
    'low': 20,
    'medium': 25,
    'high': 30,
    'critical': 35,
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${sizes[severity]}px;
        height: ${sizes[severity]}px;
        background-color: ${colors[type]};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          ${severity === 'critical' ? 'animation: pulse 1s infinite;' : ''}
        "></div>
      </div>
    `,
    iconSize: [sizes[severity], sizes[severity]],
    iconAnchor: [sizes[severity] / 2, sizes[severity] / 2],
  });
};

// Sample data for demonstration
const sampleReports: HazardReport[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Citizen',
    type: 'tsunami',
    title: 'Unusual Wave Activity',
    description: 'Observed unusually high waves approaching the shore. Water level rising rapidly.',
    location: { lat: 17.6868, lng: 83.2185, address: 'Visakhapatnam Beach, AP' },
    severity: 'critical',
    timestamp: new Date().toISOString(),
    verified: false,
    socialMediaMentions: 23,
    images: ['image1.jpg'],
  },
  {
    id: '2',
    userId: '2',
    userName: 'Coastal Officer',
    type: 'high-waves',
    title: 'High Wave Alert',
    description: 'Waves reaching 4-5 meters height observed along the coast.',
    location: { lat: 13.0827, lng: 80.2707, address: 'Marina Beach, Chennai' },
    severity: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verified: true,
    socialMediaMentions: 12,
  },
  {
    id: '3',
    userId: '3',
    userName: 'Local Fisherman',
    type: 'storm-surge',
    title: 'Storm Surge Warning',
    description: 'Strong winds and rising water levels. Fishing boats advised to return.',
    location: { lat: 15.2993, lng: 74.1240, address: 'Panaji, Goa' },
    severity: 'medium',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    verified: false,
    socialMediaMentions: 8,
  },
];

interface InteractiveMapProps {
  reports?: HazardReport[];
  hotspots?: MapHotspot[];
  onReportClick?: (report: HazardReport) => void;
  onMapClick?: (lat: number, lng: number) => void;
  selectedReport?: string;
}

export const InteractiveMap = ({ 
  reports = sampleReports, 
  hotspots = [], 
  onReportClick,
  onMapClick,
  selectedReport 
}: InteractiveMapProps) => {
  const [selectedReportData, setSelectedReportData] = useState<HazardReport | null>(null);

  const MapClickHandler = () => {
    const map = useMap();
    
    useEffect(() => {
      if (!map || !onMapClick) return;
      
      const handleClick = (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      };
      
      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }, [map, onMapClick]);
    
    return null;
  };

  const getSeverityColor = (severity: HazardReport['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getHazardTypeLabel = (type: HazardReport['type']) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[15.9129, 79.7400]} // Center of Indian coastline
        zoom={6}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {onMapClick && <MapClickHandler />}
        
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={createHazardIcon(report.type, report.severity)}
            eventHandlers={{
              click: () => {
                setSelectedReportData(report);
                onReportClick?.(report);
              },
            }}
          >
            <Popup className="max-w-sm">
              <div className="p-4 max-w-xs">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">{report.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${
                    report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.severity.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  {getHazardTypeLabel(report.type)}
                </p>
                
                <p className="text-sm mb-3">{report.description}</p>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📍 {report.location.address}</div>
                  <div>👤 {report.userName}</div>
                  <div>🕒 {format(new Date(report.timestamp), 'MMM d, HH:mm')}</div>
                  
                  {report.verified && (
                    <div className="text-green-600">✓ Verified by Officials</div>
                  )}
                  
                  {report.socialMediaMentions && (
                    <div>📱 {report.socialMediaMentions} social media mentions</div>
                  )}
                  
                  {report.images && report.images.length > 0 && (
                    <div>📷 {report.images.length} photo{report.images.length > 1 ? 's' : ''}</div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Hazard Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-destructive rounded-full border-2 border-white"></div>
            <span>Tsunami</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning rounded-full border-2 border-white"></div>
            <span>High Waves</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
            <span>Storm Surge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
            <span>Coastal Damage</span>
          </div>
        </div>
      </div>
      
      {/* Report Count */}
      <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg z-[1000]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="font-semibold">{reports.length} Active Reports</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {format(new Date(), 'HH:mm')}
        </p>
      </div>
    </div>
  );
};