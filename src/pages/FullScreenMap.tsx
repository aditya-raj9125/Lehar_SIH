import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MessageSquare, MapPin, Filter, Shield, FileText, Phone, X, Maximize2 } from 'lucide-react';
import { ReportSubmissionModal } from '@/components/Reports/ReportSubmissionModal';
import { HazardReport } from '@/types';

// Lazy load the map component to avoid SSR issues
const IndiaMap = lazy(() => import('@/components/Map/IndiaMap'));

// Sample hazard reports data for the map
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

export default function FullScreenMap() {
  const navigate = useNavigate();
  const [layers, setLayers] = useState({
    citizenReports: true,
    socialMedia: true,
    officialReports: false,
  });

  const [filters, setFilters] = useState({
    type: 'all',
    timeRange: '24h',
    source: 'all',
    verification: 'all',
    severity: 'all',
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reports, setReports] = useState<HazardReport[]>(sampleReports);

  const handleReportSubmit = (reportData: Partial<HazardReport>) => {
    console.log('Report submitted from FullScreenMap:', reportData);
    // Add new report to the map
    if (reportData.latitude && reportData.longitude) {
      const newReport: HazardReport = {
        id: Date.now().toString(),
        userId: 'guest',
        userName: 'Guest User',
        type: reportData.type || 'other',
        description: reportData.description || '',
        location: reportData.location || 'Unknown Location',
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        timestamp: new Date().toISOString(),
        severity: reportData.severity || 'medium',
        status: 'received',
        source: 'citizen',
      };
      setReports(prev => [...prev, newReport]);
    }
  };

  // Filter reports based on current filters and layers
  const filteredReports = reports.filter(report => {
    if (!layers.citizenReports && report.source === 'citizen') return false;
    if (!layers.socialMedia && report.source === 'social') return false;
    if (!layers.officialReports && report.source === 'official') return false;
    
    if (filters.type !== 'all' && report.type !== filters.type) return false;
    if (filters.source !== 'all' && report.source !== filters.source) return false;
    if (filters.severity !== 'all' && report.severity !== filters.severity) return false;
    if (filters.verification !== 'all') {
      if (filters.verification === 'verified' && report.status !== 'verified') return false;
      if (filters.verification === 'unverified' && report.status === 'verified') return false;
    }
    
    return true;
  });

  // Load reports from localStorage on component mount
  useEffect(() => {
    const storedReports = localStorage.getItem('hazardReports');
    if (storedReports) {
      try {
        const parsedReports = JSON.parse(storedReports);
        setReports(prev => [...prev, ...parsedReports]);
      } catch (error) {
        console.error('Failed to parse stored reports:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-ocean rounded"></div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LEHAR</h1>
              <p className="text-xs text-muted-foreground">Ocean Hazard Reporting System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsReportModalOpen(true)}
              className="text-foreground hover:text-primary"
            >
              <FileText className="w-4 h-4 mr-2" />
              Report Now
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-foreground hover:text-primary"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/map')}
              className="text-foreground hover:text-primary"
            >
              Map Viewer
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-foreground hover:text-primary"
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-64px)]">
        {/* Sidebar Controls */}
        <div className="w-80 border-r bg-background/50 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5" />
                  Full Screen Map
                </CardTitle>
                <CardDescription>
                  Interactive map of India with hazard reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Layers</h3>
                  <label className="flex items-center gap-3">
                    <Checkbox checked={layers.citizenReports} onCheckedChange={(v) => setLayers(prev => ({ ...prev, citizenReports: Boolean(v) }))} />
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Citizen Reports</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <Checkbox checked={layers.socialMedia} onCheckedChange={(v) => setLayers(prev => ({ ...prev, socialMedia: Boolean(v) }))} />
                    <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Social Media</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <Checkbox checked={layers.officialReports} onCheckedChange={(v) => setLayers(prev => ({ ...prev, officialReports: Boolean(v) }))} />
                    <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Official Reports</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Filters</h3>
                  <div className="space-y-2">
                    <label className="text-sm">Hazard Type</label>
                    <Select value={filters.type} onValueChange={(v) => setFilters(prev => ({ ...prev, type: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="tsunami">Tsunami</SelectItem>
                        <SelectItem value="high-waves">High Waves</SelectItem>
                        <SelectItem value="storm-surge">Storm Surge</SelectItem>
                        <SelectItem value="coastal-damage">Coastal Damage</SelectItem>
                        <SelectItem value="unusual-tides">Unusual Tides</SelectItem>
                        <SelectItem value="swell-surge">Swell Surge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Source</label>
                    <Select value={filters.source} onValueChange={(v) => setFilters(prev => ({ ...prev, source: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="citizen">Citizen Reports</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="verified">Verified Incidents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Severity</label>
                    <Select value={filters.severity} onValueChange={(v) => setFilters(prev => ({ ...prev, severity: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  {layers.citizenReports && <Badge variant="secondary" className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Reports</Badge>}
                  {layers.socialMedia && <Badge variant="secondary" className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Social</Badge>}
                  {layers.officialReports && <Badge variant="secondary" className="flex items-center gap-1"><Shield className="w-3 h-3" /> Official</Badge>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <Suspense fallback={
            <div className="h-full flex items-center justify-center bg-muted/40">
              <div className="text-center bg-background border px-6 py-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-2">Loading Map...</h3>
                <p className="text-muted-foreground mb-2">Initializing full-screen map of India</p>
              </div>
            </div>
          }>
            <IndiaMap reports={filteredReports} />
          </Suspense>
        </div>
      </main>

      {/* Report Modal */}
      <ReportSubmissionModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
