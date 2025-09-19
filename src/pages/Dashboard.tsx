import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SocialMediaPanel } from '@/components/Dashboard/SocialMediaPanel';
import { ReportSubmissionModal } from '@/components/Reports/ReportSubmissionModal';
import { 
  Plus, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  MapPin,
  Clock,
  Shield,
  Waves,
  Activity,
  Maximize2
} from 'lucide-react';
import { HazardReport } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

// Lazy load the map component to avoid SSR issues
const IndiaMap = lazy(() => import('@/components/Map/IndiaMap'));

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [reports, setReports] = useState<HazardReport[]>([]);

  // Sample reports for the map
  const sampleReports: HazardReport[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Citizen',
      type: 'tsunami',
      description: 'Unusual wave activity observed near the coast',
      location: 'Chennai, Tamil Nadu',
      latitude: 13.0827,
      longitude: 80.2707,
      timestamp: new Date().toISOString(),
      severity: 'medium',
      status: 'received',
      source: 'citizen',
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Official',
      type: 'high-waves',
      description: 'High wave warning issued by IMD',
      location: 'Mumbai, Maharashtra',
      latitude: 19.0760,
      longitude: 72.8777,
      timestamp: new Date().toISOString(),
      severity: 'high',
      status: 'verified',
      source: 'official',
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Reporter',
      type: 'storm-surge',
      description: 'Storm surge reported on social media',
      location: 'Kolkata, West Bengal',
      latitude: 22.5726,
      longitude: 88.3639,
      timestamp: new Date().toISOString(),
      severity: 'low',
      status: 'under-review',
      source: 'social',
    },
  ];

  // Load reports from localStorage
  useEffect(() => {
    const loadReports = () => {
      const storedReports = localStorage.getItem('hazardReports');
      if (storedReports) {
        try {
          const parsedReports = JSON.parse(storedReports);
          setReports([...sampleReports, ...parsedReports]);
        } catch (error) {
          console.error('Failed to parse stored reports:', error);
          setReports(sampleReports);
        }
      } else {
        setReports(sampleReports);
      }
    };

    // Load initial reports
    loadReports();

    // Listen for new reports
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hazardReports') {
        loadReports();
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleNewReport = () => {
      loadReports();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('newReportAdded', handleNewReport);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newReportAdded', handleNewReport);
    };
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleReportSubmit = (reportData: Partial<HazardReport>) => {
    const newReport: HazardReport = {
      id: Date.now().toString(),
      userId: reportData.userId || '',
      userName: reportData.userName || '',
      type: reportData.type || 'high-waves',
      title: reportData.title || '',
      description: reportData.description || '',
      location: reportData.location || { lat: 0, lng: 0, address: '' },
      severity: reportData.severity || 'medium',
      timestamp: reportData.timestamp || new Date().toISOString(),
      verified: false,
      images: reportData.images || [],
    };
    
    setReports(prev => [newReport, ...prev]);
  };

  const statsCards = [
    {
      title: 'Active Reports',
      value: '12',
      change: '+3 from yesterday',
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Verified Incidents',
      value: '8',
      change: '+2 verified today',
      icon: Shield,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Social Mentions',
      value: '1.2K',
      change: '+15% this hour',
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Areas Monitored',
      value: '24',
      change: 'All coastal regions',
      icon: MapPin,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const recentAlerts = [
    {
      id: '1',
      type: 'Tsunami Alert',
      location: 'Visakhapatnam, AP',
      severity: 'critical' as const,
      time: '5 minutes ago',
      status: 'Active',
    },
    {
      id: '2',
      type: 'High Wave Warning',
      location: 'Chennai, TN',
      severity: 'high' as const,
      time: '15 minutes ago',
      status: 'Monitoring',
    },
    {
      id: '3',
      type: 'Storm Surge Alert',
      location: 'Mumbai, MH',
      severity: 'medium' as const,
      time: '1 hour ago',
      status: 'Resolved',
    },
  ];

  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ocean Monitoring Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time coastal hazard monitoring and community reporting
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user?.role === 'citizen' && (
            <Button 
              onClick={() => setIsReportModalOpen(true)}
              className="bg-gradient-ocean hover:shadow-ocean"
            >
              <Plus className="w-4 h-4 mr-2" />
              Report Hazard
            </Button>
          )}
          
          <Badge className="bg-gradient-wave wave-animation text-white">
            <Activity className="w-3 h-3 mr-1" />
            Live Monitoring
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-coastal transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Interactive Hazard Map
              </CardTitle>
              <CardDescription>
                Real-time coastal hazard monitoring across India
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)] relative">
              <Suspense fallback={
                <div className="h-full flex items-center justify-center bg-muted/40">
                  <div className="text-center bg-background border px-6 py-8 rounded-lg shadow-sm">
                    <h3 className="text-2xl font-semibold mb-2">Loading Map...</h3>
                    <p className="text-muted-foreground mb-2">Initializing interactive map of India</p>
                  </div>
                </div>
              }>
                <IndiaMap reports={reports} />
              </Suspense>
              
              {/* View Detailed Button - positioned in bottom right corner */}
              <Button 
                onClick={() => navigate('/fullscreen-map')}
                className="absolute bottom-4 right-4 bg-gradient-ocean hover:shadow-ocean shadow-lg z-[9999]"
                size="sm"
                style={{ zIndex: 9999 }}
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                View Detailed
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/50"
                >
                  <div className="w-2 h-2 rounded-full bg-destructive mt-2 animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{alert.type}</p>
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{alert.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-3" size="sm">
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Satellite Monitoring</span>
                <Badge className="bg-success text-success-foreground">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sensor Network</span>
                <Badge className="bg-success text-success-foreground">98% Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Social Media API</span>
                <Badge className="bg-success text-success-foreground">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Emergency Services</span>
                <Badge className="bg-warning text-warning-foreground">Standby</Badge>
              </div>
              
              <div className="pt-2 text-xs text-muted-foreground text-center">
                Last updated: {format(new Date(), 'HH:mm:ss')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Media Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <SocialMediaPanel />
        </div>
      </div>

      {/* Report Submission Modal */}
      <ReportSubmissionModal
        open={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedLocation(null);
        }}
        onSubmit={handleReportSubmit}
        prefilledLocation={selectedLocation ? {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          address: `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
        } : undefined}
      />
    </div>
  );
}