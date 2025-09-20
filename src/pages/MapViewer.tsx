import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MessageSquare, MapPin, Filter, BarChart3, Users, Globe, Shield, FileText, Phone, Maximize2 } from 'lucide-react';
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
    location: { lat: 13.0827, lng: 80.2707, address: 'Chennai, Tamil Nadu' },
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
    location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
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
    location: { lat: 22.5726, lng: 88.3639, address: 'Kolkata, West Bengal' },
    timestamp: new Date().toISOString(),
    severity: 'low',
    status: 'under-review',
    source: 'social',
  },
];

export default function MapViewer() {
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
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleReportSubmit = (reportData: Partial<HazardReport>) => {
    console.log('Report submitted from MapViewer:', reportData);
    // Add new report to the map
    if (reportData.location?.lat && reportData.location?.lng) {
      const newReport: HazardReport = {
        id: Date.now().toString(),
        userId: 'guest',
        userName: 'Guest User',
        type: reportData.type || 'other',
        description: reportData.description || '',
        location: reportData.location,
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
    const loadReports = () => {
      const storedReports = localStorage.getItem('hazardReports');
      console.log('🗺️ MapViewer loading reports...');
      console.log('📦 Stored reports:', storedReports);
      
      if (storedReports) {
        try {
          const parsedReports = JSON.parse(storedReports);
          const allReports = [...sampleReports, ...parsedReports];
          console.log('📋 Sample reports:', sampleReports.length);
          console.log('📋 Parsed reports:', parsedReports.length);
          console.log('📋 Total reports:', allReports.length);
          setReports(allReports);
        } catch (error) {
          console.error('Failed to parse stored reports:', error);
          setReports(sampleReports);
        }
      } else {
        console.log('❌ No stored reports found, using sample reports');
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

  // Load map after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header (same as Landing) */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-ocean rounded"></div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LEHAR</h1>
              <p className="text-xs text-muted-foreground">Ocean Hazard Reporting System</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-foreground hover:text-primary"
            >
              Home
            </Button>
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
              onClick={() => navigate('/map')}
              className="text-foreground hover:text-primary"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map Viewer
            </Button>
            
          </nav>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-foreground hover:text-primary"
            >
              Sign In
            </Button>
            <Button 
              variant="default" 
              onClick={() => navigate('/auth?tab=register')}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-2 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Layers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 py-6">
          <div className="space-y-4">
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

          <div className="space-y-4">
            <h3 className="font-semibold">Filters</h3>

            <div className="space-y-3">
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
              <label className="text-sm">Time Range</label>
              <Select value={filters.timeRange} onValueChange={(v) => setFilters(prev => ({ ...prev, timeRange: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Last 24 hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6h">Last 6 hours</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm">Verification</label>
                <Select value={filters.verification} onValueChange={(v) => setFilters(prev => ({ ...prev, verification: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
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

            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" /> Apply Filters
            </Button>
            
            <Button 
              onClick={() => navigate('/fullscreen-map')}
              className="w-full bg-gradient-ocean hover:shadow-ocean shadow-lg"
              size="sm"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              View Detailed
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Interactive Map</CardTitle>
              <CardDescription>Map integration with Leaflet/OpenStreetMap</CardDescription>
            </div>
            <div className="flex gap-2">
              {layers.citizenReports && <Badge variant="secondary" className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Reports</Badge>}
              {layers.socialMedia && <Badge variant="secondary" className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Social</Badge>}
              {layers.officialReports && <Badge variant="secondary" className="flex items-center gap-1"><Shield className="w-3 h-3" /> Official</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="h-[85vh] rounded-lg overflow-hidden relative">
            <Suspense fallback={
              <div className="h-full rounded-lg bg-muted/40 flex items-center justify-center">
                <div className="text-center bg-background border px-6 py-8 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-semibold mb-2">Loading Map...</h3>
                  <p className="text-muted-foreground mb-2">Initializing interactive map of India</p>
                </div>
              </div>
            }>
              <IndiaMap reports={filteredReports} />
            </Suspense>
            
          </div>
        </CardContent>
      </Card>
      </main>

      {/* Report Modal */}
      <ReportSubmissionModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      {/* Footer (same as Landing) */}
      <footer className="border-t bg-background/95 text-foreground py-1 px-2">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-y-1 md:gap-y-2 gap-x-6 md:gap-x-10">
            {/* Logo and Description */}
            <div className="md:col-span-1 md:pr-32 lg:pr-40">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <div>
                  <h3 className="text-xl font-bold">LEHAR</h3>
                </div>
              </div>
              <p className="text-sm opacity-80 leading-relaxed whitespace-nowrap">
                Localized Early-warning & Hazard Assessment for Response
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:pl-24 lg:pl-40">
              <h4 className="text-lg font-semibold mb-4 whitespace-nowrap">Quick Links</h4>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 items-center">
                <li className="inline">
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto" onClick={() => setIsReportModalOpen(true)}>
                    Report now
                  </Button>
                </li>
                <li className="inline">
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto" onClick={() => navigate('/map')}>
                    Live Map
                  </Button>
                </li>
                <li className="inline">
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                </li>
                <li className="inline">
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto" onClick={() => navigate('/auth?tab=register')}>
                    Sign Up
                  </Button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:pl-24 lg:pl-40">
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm opacity-80">
                <p>Email: support@incois.gov.in</p>
                <p>Contact: +91-XXX-XXXX-XXX</p>
              </div>
            </div>

            {/* Social */}
            <div className="md:pl-24 lg:pl-40">
              <h4 className="text-lg font-semibold mb-4">Social</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto text-sm">
                    Facebook
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto text-sm">
                    Instagram
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto text-sm">
                    Twitter
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto text-sm">
                    YouTube
                  </Button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="md:pl-12 lg:pl-16">
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto text-sm">
                    Privacy Policy
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-foreground/80 hover:text-foreground p-0 h-auto text-sm">
                    Terms of Service
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-2 pt-1 border-t border-foreground/20">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm opacity-80 mb-4 md:mb-0">
                © 2025 LEHAR - Ocean Hazard Reporting System. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>NDRF | 1800-123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Coast Guard | 1554</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}