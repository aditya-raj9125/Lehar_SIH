import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  AlertTriangle, 
  MessageCircle, 
  BarChart3, 
  Users, 
  Bell,
  Search,
  Settings,
  LogOut,
  Wifi,
  Map,
  Eye,
  TrendingUp,
  Activity,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  Plus,
  FileText,
  Calendar,
  PieChart,
  Target,
  AlertCircle,
  Truck,
  MessageSquare,
  Phone
} from 'lucide-react';
import { HazardReport } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { SocialMediaPanel } from '@/components/Dashboard/SocialMediaPanel';
import { SocialMediaFeed } from '@/components/SocialMedia/SocialMediaFeed';
import { ReportSubmissionModal } from '@/components/Reports/ReportSubmissionModal';

// Lazy load components
const IndiaMap = lazy(() => import('@/components/Map/IndiaMap'));

// Sample data
const sampleReports: HazardReport[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Dr. Sarah Official',
    type: 'tsunami',
    title: 'Tsunami Alert - Visakhapatnam',
    description: 'Unusual wave patterns detected by satellite monitoring. Immediate evacuation recommended for coastal areas.',
    location: { lat: 17.6868, lng: 83.2185, address: 'Visakhapatnam, Andhra Pradesh' },
    severity: 'critical',
    timestamp: new Date().toISOString(),
    verified: true,
    status: 'verified',
    source: 'official',
  },
  {
    id: '2',
    userId: '2',
    userName: 'John Citizen',
    type: 'high-waves',
    title: 'High Waves at Marina Beach',
    description: 'Waves reaching 4-5 meters height observed. Swimming activities suspended.',
    location: { lat: 13.0827, lng: 80.2707, address: 'Marina Beach, Chennai' },
    severity: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verified: true,
    status: 'verified',
    source: 'citizen',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Local Reporter',
    type: 'storm-surge',
    title: 'Storm Surge Alert - Mumbai',
    description: 'Strong winds causing storm surge. Water entering coastal roads.',
    location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
    severity: 'medium',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    verified: false,
    status: 'under-review',
    source: 'citizen',
  },
];

const alerts = [
  {
    id: '1',
    type: 'Tsunami Alert',
    location: 'Visakhapatnam, AP',
    severity: 'critical' as const,
    time: '5 minutes ago',
    status: 'Active',
    description: 'Unusual wave patterns detected. Immediate evacuation recommended.',
  },
  {
    id: '2',
    type: 'High Wave Warning',
    location: 'Chennai, TN',
    severity: 'high' as const,
    time: '15 minutes ago',
    status: 'Monitoring',
    description: 'Waves reaching 4-5 meters height. Swimming activities suspended.',
  },
  {
    id: '3',
    type: 'Storm Surge Alert',
    location: 'Mumbai, MH',
    severity: 'medium' as const,
    time: '1 hour ago',
    status: 'Resolved',
    description: 'Storm surge conditions have stabilized. Monitoring continues.',
  },
];

export default function OfficialDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('alerts');
  const [reports, setReports] = useState<HazardReport[]>(sampleReports);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load reports from API and localStorage
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // The reports endpoint is public, no authentication required
        const response = await fetch('http://localhost:5000/api/reports', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          if (data.success && data.reports) {
            // Convert backend format to frontend format
            const apiReports: HazardReport[] = data.reports.map((report: any) => ({
              id: report.id,
              userId: report.user_id || '',
              userName: report.reporter_name || 'Unknown',
              type: report.type,
              title: report.title,
              description: report.description,
              location: {
                lat: parseFloat(report.location_lat),
                lng: parseFloat(report.location_lng),
                address: report.location_address
              },
              severity: report.severity,
              timestamp: report.created_at,
              verified: report.verified || false,
              status: report.status || 'received',
              source: report.source || 'citizen',
              images: report.images || [],
              videos: report.videos || [],
              socialMediaMentions: report.social_media_mentions || 0
            }));
            console.log('Converted reports:', apiReports);
            setReports(apiReports);
            return;
          }
        } else {
          console.error('API response not ok:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch reports from API:', error);
      }

      // Fallback to localStorage if API fails
      try {
        const raw = localStorage.getItem('hazardReports');
        const local: HazardReport[] = raw ? JSON.parse(raw) : [];
        if (local.length) {
          setReports(prev => [...local, ...prev]);
        }
      } catch (error) {
        console.error('Failed to load reports from localStorage:', error);
      }
    };

    const loadReports = () => {
      fetchReports();
    };

    loadReports();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hazardReports') {
        loadReports();
      }
    };

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

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getHazardIcon = (type: HazardReport['type']) => {
    switch (type) {
      case 'tsunami': return '🌊';
      case 'high-waves': return '🏄';
      case 'storm-surge': return '🌪️';
      case 'coastal-damage': return '🏗️';
      case 'unusual-tides': return '🌀';
      case 'swell-surge': return '〰️';
      default: return '⚠️';
    }
  };

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAlerts = () => {
    // Mock alert data
    const alerts = [
      {
        id: '1',
        type: 'tsunami',
        severity: 'critical' as const,
        title: 'Tsunami Warning - Visakhapatnam',
        description: 'Unusual wave patterns detected by satellite monitoring. Immediate evacuation recommended for coastal areas.',
        location: 'Visakhapatnam, Andhra Pradesh',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const,
        source: 'satellite',
        affectedPopulation: 50000,
        evacuationStatus: 'in-progress'
      },
      {
        id: '2',
        type: 'storm-surge',
        severity: 'high' as const,
        title: 'Storm Surge Alert - Mumbai',
        description: 'Strong winds causing storm surge. Water entering coastal roads.',
        location: 'Mumbai, Maharashtra',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'monitoring' as const,
        source: 'weather-station',
        affectedPopulation: 25000,
        evacuationStatus: 'standby'
      },
      {
        id: '3',
        type: 'high-waves',
        severity: 'medium' as const,
        title: 'High Waves Warning - Chennai',
        description: 'Waves reaching 4-5 meters height observed. Swimming activities suspended.',
        location: 'Chennai, Tamil Nadu',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'resolved' as const,
        source: 'coastal-monitor',
        affectedPopulation: 15000,
        evacuationStatus: 'completed'
      }
    ];

    const getAlertIcon = (type: string) => {
      switch (type) {
        case 'tsunami': return '🌊';
        case 'storm-surge': return '⛈️';
        case 'high-waves': return '🌊';
        default: return '⚠️';
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return 'destructive';
        case 'monitoring': return 'default';
        case 'resolved': return 'secondary';
        default: return 'outline';
      }
    };

    const getEvacuationColor = (status: string) => {
      switch (status) {
        case 'in-progress': return 'destructive';
        case 'standby': return 'default';
        case 'completed': return 'secondary';
        default: return 'outline';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Alert Management</h2>
            <p className="text-muted-foreground">Monitor and manage active hazard alerts</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Send Alert
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'active').length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold">{alerts.filter(a => a.severity === 'critical').length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Affected Population</p>
                  <p className="text-2xl font-bold">
                    {alerts.reduce((sum, a) => sum + a.affectedPopulation, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Evacuations</p>
                  <p className="text-2xl font-bold">{alerts.filter(a => a.evacuationStatus === 'in-progress').length}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              Current hazard alerts requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{alert.title}</h3>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant={getStatusColor(alert.status)}>
                            {alert.status.toUpperCase()}
                          </Badge>
                          <Badge variant={getEvacuationColor(alert.evacuationStatus)}>
                            {alert.evacuationStatus.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(alert.timestamp), 'MMM d, HH:mm')}
                        </div>
                      </div>
                      
                      <p className="text-foreground mb-3">{alert.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{alert.affectedPopulation.toLocaleString()} affected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span>Source: {alert.source}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Escalate
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Update
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Alert Timeline
            </CardTitle>
            <CardDescription>
              Recent alert activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={alert.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-sm">{getAlertIcon(alert.type)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{alert.title}</span>
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{format(new Date(alert.timestamp), 'MMM d, HH:mm')}</span>
                      <span>•</span>
                      <span>{alert.location}</span>
                      <span>•</span>
                      <span>{alert.affectedPopulation.toLocaleString()} people</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              Quick access to emergency services and authorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'NDRF Control Room', number: '011-24363260', type: 'emergency' },
                { name: 'Coast Guard', number: '1554', type: 'emergency' },
                { name: 'IMD Weather', number: '1800-180-1717', type: 'weather' },
                { name: 'Disaster Management', number: '108', type: 'emergency' },
                { name: 'Police Control', number: '100', type: 'emergency' },
                { name: 'Fire Services', number: '101', type: 'emergency' }
              ].map((contact, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{contact.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {contact.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-mono">{contact.number}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderInteractiveMap = () => (
    <div className="space-y-6">
      <Card className="h-[600px]">
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
        </CardContent>
      </Card>
    </div>
  );

  const renderMyReports = () => {
    const myReports = filteredReports.filter(r => r.userId === user?.id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">My Reports</h2>
            <p className="text-muted-foreground">Reports submitted by you</p>
          </div>
          <Button onClick={() => setIsReportModalOpen(true)} className="bg-gradient-ocean hover:shadow-ocean">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{myReports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold">{myReports.filter(r => r.verified).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold">{myReports.filter(r => r.severity === 'critical').length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">
                    {myReports.filter(r => {
                      const reportDate = new Date(r.timestamp);
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return reportDate > weekAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="grid gap-4">
          {myReports.length > 0 ? (
            myReports.map((report) => (
              <Card key={report.id} className="hover:shadow-coastal transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{getHazardIcon(report.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          <Badge variant={getSeverityColor(report.severity)}>
                            {report.severity.toUpperCase()}
                          </Badge>
                          {report.verified && (
                            <Badge variant="default" className="bg-success text-success-foreground">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(report.timestamp), 'MMM d, HH:mm')}
                        </div>
                      </div>
                      <p className="text-foreground mb-4">{report.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{report.location.address}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't submitted any reports yet. Create your first report to get started.
                </p>
                <Button onClick={() => setIsReportModalOpen(true)} className="bg-gradient-ocean hover:shadow-ocean">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        {myReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your recent report submissions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myReports.slice(0, 3).map((report, index) => (
                  <div key={report.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {getHazardIcon(report.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(report.timestamp), 'MMM d, yyyy at HH:mm')}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(report.severity)} className="text-xs">
                      {report.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderSocialTrends = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Social Media Monitor</h2>
        <p className="text-muted-foreground">Real-time social media monitoring and hazard detection</p>
      </div>
      <SocialMediaFeed />
    </div>
  );

  const renderAnalytics = () => {
    const hazardTypeStats = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const severityStats = reports.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentReports = reports.filter(r => {
      const reportDate = new Date(r.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return reportDate > weekAgo;
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Analytics</h2>
          <p className="text-muted-foreground">Comprehensive data analysis and insights</p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold mt-2">{reports.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified Reports</p>
                  <p className="text-2xl font-bold mt-2">{reports.filter(r => r.verified).length}</p>
                  <p className="text-xs text-muted-foreground mt-1">85% accuracy rate</p>
                </div>
                <div className="p-3 rounded-lg bg-success/10">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                  <p className="text-2xl font-bold mt-2">{reports.filter(r => r.severity === 'critical').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active monitoring</p>
                </div>
                <div className="p-3 rounded-lg bg-destructive/10">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold mt-2">4.2m</p>
                  <p className="text-xs text-muted-foreground mt-1">Average response</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hazard Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Hazard Types Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of reports by hazard type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(hazardTypeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{getHazardIcon(type as any)}</div>
                      <span className="text-sm font-medium capitalize">
                        {type.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / reports.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Severity Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Severity Analysis
              </CardTitle>
              <CardDescription>
                Reports categorized by severity level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(severityStats).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeverityColor(severity as any)} className="text-xs">
                        {severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium capitalize">{severity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getSeverityColor(severity as any) === 'destructive' ? 'bg-destructive' : 
                            getSeverityColor(severity as any) === 'default' ? 'bg-primary' : 
                            getSeverityColor(severity as any) === 'secondary' ? 'bg-secondary' : 'bg-muted'}`}
                          style={{ width: `${(count / reports.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Reports (Last 7 Days)
              </CardTitle>
              <CardDescription>
                Latest report submissions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {getHazardIcon(report.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(report.timestamp), 'MMM d, HH:mm')}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(report.severity)} className="text-xs">
                      {report.severity}
                    </Badge>
                  </div>
                ))}
                {recentReports.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No reports in the last 7 days</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                System performance and response metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verification Rate</span>
                  <span className="text-sm font-bold">
                    {reports.length > 0 ? Math.round((reports.filter(r => r.verified).length / reports.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Response Time</span>
                  <span className="text-sm font-bold">4.2 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Critical Response Rate</span>
                  <span className="text-sm font-bold">98.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Uptime</span>
                  <span className="text-sm font-bold">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Accuracy</span>
                  <span className="text-sm font-bold">94.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Reports distribution across different coastal regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Mumbai', 'Chennai', 'Kolkata', 'Visakhapatnam', 'Goa', 'Kochi'].map((location) => {
                const locationReports = reports.filter(r => 
                  r.location.address.toLowerCase().includes(location.toLowerCase())
                );
                return (
                  <div key={location} className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{location}</span>
                      <Badge variant="outline">{locationReports.length}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {locationReports.length > 0 ? (
                        <>
                          {locationReports.filter(r => r.severity === 'critical').length} Critical, {' '}
                          {locationReports.filter(r => r.severity === 'high').length} High
                        </>
                      ) : (
                        'No reports'
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAllReports = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState<'date' | 'severity' | 'type'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Sorting logic
    const sortedReports = [...filteredReports].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReports = sortedReports.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">All Reports</h2>
            <p className="text-muted-foreground">Complete overview of all hazard reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('Manual refresh triggered');
                // Trigger a manual refresh
                window.dispatchEvent(new Event('newReportAdded'));
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Sort by:</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-border rounded-md text-sm"
                  >
                    <option value="date">Date</option>
                    <option value="severity">Severity</option>
                    <option value="type">Type</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Order:</label>
                  <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="px-3 py-1 border border-border rounded-md text-sm"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedReports.length)} of {sortedReports.length} reports
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="grid gap-4">
          {paginatedReports.map((report) => (
            <Card key={report.id} className="hover:shadow-coastal transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getHazardIcon(report.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{report.title}</h3>
                        <Badge variant={getSeverityColor(report.severity)}>
                          {report.severity.toUpperCase()}
                        </Badge>
                        {report.verified && (
                          <Badge variant="default" className="bg-success text-success-foreground">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {report.type.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(report.timestamp), 'MMM d, HH:mm')}
                      </div>
                    </div>
                    <p className="text-foreground mb-4">{report.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{report.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{report.location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(report.timestamp), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Total Reports:</strong> {sortedReports.length}</p>
                <p><strong>Sample Reports:</strong> {sampleReports.length}</p>
                <p><strong>API Status:</strong> Public endpoint</p>
              </div>
              <div>
                <p><strong>User ID:</strong> {user?.id || 'None'}</p>
                <p><strong>User Role:</strong> {user?.role || 'None'}</p>
                <p><strong>API URL:</strong> http://localhost:5000/api/reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{sortedReports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold">{sortedReports.filter(r => r.verified).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold">{sortedReports.filter(r => r.severity === 'critical').length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {sortedReports.filter(r => {
                      const reportDate = new Date(r.timestamp);
                      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                      return reportDate > monthAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 text-white font-bold">INCOIS</div>
              </div>
              <div>
                <div className="font-semibold text-sm">INCOIS</div>
                <div className="text-xs text-muted-foreground">Ocean Monitoring</div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="font-medium text-sm">{user?.name || 'Dr. Sarah Official'}</div>
                <div className="text-xs text-muted-foreground">Official</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Button
                variant={activeTab === 'map' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('map')}
              >
                <Map className="w-4 h-4 mr-3" />
                Interactive Map
              </Button>
              
              <Button
                variant={activeTab === 'my-reports' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('my-reports')}
              >
                <AlertTriangle className="w-4 h-4 mr-3" />
                My Reports
              </Button>
              
              <Button
                variant={activeTab === 'social-trends' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('social-trends')}
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                Social Trends
                <Badge variant="secondary" className="ml-auto">12</Badge>
              </Button>
              
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Analytics
              </Button>
              
              <Button
                variant={activeTab === 'all-reports' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('all-reports')}
              >
                <Users className="w-4 h-4 mr-3" />
                All Reports
                <Badge variant="secondary" className="ml-auto">45</Badge>
              </Button>
              
              <Button
                variant={activeTab === 'alerts' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('alerts')}
              >
                <Bell className="w-4 h-4 mr-3" />
                Alerts
                <Badge variant="secondary" className="ml-auto">3</Badge>
              </Button>
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-muted/50 border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search reports, locations, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Location unavailable
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-success">
                  <Wifi className="w-4 h-4" />
                  Online
                </div>
                <Badge variant="destructive">2 Active Alerts</Badge>
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </div>
                <Badge className="bg-primary text-primary-foreground">Official</Badge>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {activeTab === 'alerts' && renderAlerts()}
            {activeTab === 'map' && renderInteractiveMap()}
            {activeTab === 'my-reports' && renderMyReports()}
            {activeTab === 'social-trends' && renderSocialTrends()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'all-reports' && renderAllReports()}
          </div>
        </div>
      </div>

      {/* Report Submission Modal */}
      <ReportSubmissionModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={(reportData) => {
          const newReport: HazardReport = {
            id: Date.now().toString(),
            userId: user?.id || '',
            userName: user?.name || '',
            type: reportData.type || 'high-waves',
            title: reportData.title || '',
            description: reportData.description || '',
            location: reportData.location || { lat: 0, lng: 0, address: '' },
            severity: reportData.severity || 'medium',
            timestamp: reportData.timestamp || new Date().toISOString(),
            verified: false,
            images: reportData.images || [],
            status: 'received',
            source: 'official',
          };
          setReports(prev => [newReport, ...prev]);
        }}
      />
    </div>
  );
}
