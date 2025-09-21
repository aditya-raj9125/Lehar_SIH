import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  MessageCircle,
  Hash,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Users,
  Activity,
  BarChart3,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { socialMediaService, SocialMediaPost, SocialMediaTrend, SocialMediaAlert } from '@/services/socialMediaService';
import { SocialMediaFeed } from '@/components/SocialMedia/SocialMediaFeed';

export default function SocialMedia() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [trends, setTrends] = useState<SocialMediaTrend[]>([]);
  const [alerts, setAlerts] = useState<SocialMediaAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | SocialMediaPost['platform']>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | SocialMediaAlert['severity']>('all');
  const [isLiveMode, setIsLiveMode] = useState(true);

  useEffect(() => {
    const handleDataUpdate = (data: { posts: SocialMediaPost[], trends: SocialMediaTrend[], alerts: SocialMediaAlert[] }) => {
      setPosts(data.posts);
      setTrends(data.trends);
      setAlerts(data.alerts);
    };

    socialMediaService.subscribe(handleDataUpdate);

    return () => {
      socialMediaService.unsubscribe(handleDataUpdate);
    };
  }, []);

  const getSeverityColor = (severity: SocialMediaAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    selectedSeverity === 'all' || alert.severity === selectedSeverity
  );

  const trendingKeywords = trends
    .filter(trend => trend.trending)
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 10);

  const topPosts = posts
    .sort((a, b) => (b.engagement.likes + b.engagement.shares) - (a.engagement.likes + a.engagement.shares))
    .slice(0, 5);

  const platformStats = {
    twitter: posts.filter(p => p.platform === 'twitter').length,
    facebook: posts.filter(p => p.platform === 'facebook').length,
    youtube: posts.filter(p => p.platform === 'youtube').length,
    instagram: posts.filter(p => p.platform === 'instagram').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Real-time social media monitoring for ocean hazard detection
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          <Badge className={`${isLiveMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            <Activity className="w-3 h-3 mr-1" />
            {isLiveMode ? 'Live' : 'Paused'}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold mt-2">{posts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">+{Math.floor(Math.random() * 20)}% from yesterday</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trending Topics</p>
                <p className="text-2xl font-bold mt-2">{trendingKeywords.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Active trending keywords</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority Alerts</p>
                <p className="text-2xl font-bold mt-2">{alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold mt-2">
                  {posts.reduce((sum, post) => sum + post.engagement.likes + post.engagement.shares, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Likes + Shares</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Social Media Feed */}
        <div className="lg:col-span-2">
          <SocialMediaFeed />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending Keywords
              </CardTitle>
              <CardDescription>
                Most mentioned hazard-related keywords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingKeywords.map((trend, index) => (
                <div
                  key={trend.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{trend.keyword}</div>
                      <div className="text-xs text-muted-foreground">{trend.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{trend.mentions.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">mentions</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Platform Distribution
              </CardTitle>
              <CardDescription>
                Posts by social media platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(platformStats).map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm capitalize">{platform}</span>
                  </div>
                  <div className="text-sm font-medium">{count}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>
                Latest social media alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-secondary/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-start gap-2">
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                      {alert.severity}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{alert.keyword}</span>
                        <span>•</span>
                        <span>{alert.mentions} mentions</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
