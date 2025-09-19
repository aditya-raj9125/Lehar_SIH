import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  Camera,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
  Plus,
  Download,
  RefreshCw
} from 'lucide-react';
import { HazardReport } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ReportSubmissionModal } from '@/components/Reports/ReportSubmissionModal';

// Sample reports data
const sampleReports: HazardReport[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Citizen',
    type: 'tsunami',
    title: 'Unusual Wave Activity Observed',
    description: 'Large waves approaching shore, water level rising rapidly at Visakhapatnam beach. Local fishermen report unusual sea behavior.',
    location: { lat: 17.6868, lng: 83.2185, address: 'Visakhapatnam Beach, Andhra Pradesh' },
    severity: 'critical',
    timestamp: new Date().toISOString(),
    verified: false,
    socialMediaMentions: 23,
    images: ['tsunami_waves.jpg', 'beach_evacuation.jpg'],
    status: 'received',
    source: 'citizen',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Dr. Sarah Official',
    type: 'high-waves',
    title: 'High Wave Advisory - Marina Beach',
    description: 'Waves reaching 4-5 meters height observed. Swimming and fishing activities suspended. Coast guard on alert.',
    location: { lat: 13.0827, lng: 80.2707, address: 'Marina Beach, Chennai, Tamil Nadu' },
    severity: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verified: true,
    socialMediaMentions: 12,
    images: ['high_waves_chennai.jpg'],
    status: 'verified',
    source: 'official',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Local Fisherman Kumar',
    type: 'storm-surge',
    title: 'Storm Surge Alert - Panaji Coast',
    description: 'Strong winds causing storm surge. Water entering coastal roads. Fishing boats returning to harbor urgently.',
    location: { lat: 15.2993, lng: 74.1240, address: 'Panaji, Goa' },
    severity: 'medium',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    verified: false,
    socialMediaMentions: 8,
    status: 'received',
    source: 'citizen',
  },
  {
    id: '4',
    userId: '1',
    userName: 'Coastal Monitor',
    type: 'coastal-damage',
    title: 'Erosion Damage at Puri Beach',
    description: 'Significant coastal erosion observed after recent storms. Sea wall partially damaged, immediate attention required.',
    location: { lat: 19.8135, lng: 85.8312, address: 'Puri Beach, Odisha' },
    severity: 'high',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    verified: true,
    socialMediaMentions: 5,
    images: ['coastal_damage_puri.jpg', 'seawall_damage.jpg'],
    status: 'verified',
    source: 'official',
  },
];

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<HazardReport[]>(sampleReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | HazardReport['type']>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | HazardReport['severity']>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hazardReports');
      const local: HazardReport[] = raw ? JSON.parse(raw) : [];
      if (local.length) setReports(prev => [...local, ...prev]);
    } catch {}
  }, []);

  const persist = (list: HazardReport[]) => {
    try {
      // Only persist citizen submissions to keep demo small
      const citizen = list.filter(r => (r.source || 'citizen') === 'citizen');
      localStorage.setItem('hazardReports', JSON.stringify(citizen));
    } catch {}
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
      status: 'received',
      source: 'citizen',
    };
    setReports(prev => {
      const updated = [newReport, ...prev];
      persist(updated);
      return updated;
    });
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    
    // Tab filtering
    if (activeTab === 'my-reports') {
      return matchesSearch && matchesType && matchesSeverity && report.userId === user?.id;
    }
    if (activeTab === 'verified') {
      return matchesSearch && matchesType && matchesSeverity && report.verified;
    }
    if (activeTab === 'unverified') {
      return matchesSearch && matchesType && matchesSeverity && !report.verified;
    }
    
    return matchesSearch && matchesType && matchesSeverity;
  });

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

  const setStatus = (id: string, status: HazardReport['status']) => {
    setReports(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status, verified: status === 'verified' } : r);
      persist(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hazard Reports</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage ocean hazard reports from the community
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            onClick={() => setIsReportModalOpen(true)}
            className="bg-gradient-ocean hover:shadow-ocean"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search reports, locations, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
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
            
            <Select value={filterSeverity} onValueChange={(value: any) => setFilterSeverity(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Report List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="my-reports">My Reports ({reports.filter(r => r.userId === user?.id).length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({reports.filter(r => r.verified).length})</TabsTrigger>
          <TabsTrigger value="unverified">Unverified ({reports.filter(r => !r.verified).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredReports.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== 'all' || filterSeverity !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No hazard reports have been submitted yet.'}
                </p>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-coastal transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Hazard Type Icon */}
                      <div className="text-2xl">{getHazardIcon(report.type)}</div>
                      
                      {/* Main Content */}
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
                            {!report.verified && (
                              <Badge variant="outline" title={report.status || 'received'}>
                                {(report.status || 'received').toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(report.timestamp), 'MMM d, HH:mm')}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">
                          {getHazardTypeLabel(report.type)}
                        </p>
                        
                        <p className="text-foreground mb-4 line-clamp-2">
                          {report.description}
                        </p>
                        
                        {/* Report Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{report.userName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{report.location.address}</span>
                          </div>
                          
                          {report.socialMediaMentions && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MessageSquare className="w-4 h-4" />
                              <span>{report.socialMediaMentions} mentions</span>
                            </div>
                          )}
                          
                          {report.images && report.images.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Camera className="w-4 h-4" />
                              <span>{report.images.length} photo{report.images.length > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          
                          {user?.role === 'official' && !report.verified && (
                            <>
                              <Button variant="default" size="sm" className="bg-success hover:bg-success/90" onClick={() => setStatus(report.id, 'verified')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setStatus(report.id, 'under-review')}>
                                Mark Under Review
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => setStatus(report.id, 'rejected')}>
                                Reject
                              </Button>
                            </>
                          )}
                          
                          <Button variant="ghost" size="sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            View on Map
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Submission Modal */}
      <ReportSubmissionModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}