import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Twitter, 
  Facebook, 
  Youtube, 
  Instagram,
  TrendingUp, 
  MessageCircle,
  Hash,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Play,
  Search,
  Filter,
  AlertTriangle,
  Users,
  Activity
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { socialMediaService, SocialMediaPost, SocialMediaTrend, SocialMediaAlert } from '@/services/socialMediaService';

interface SocialMediaFeedProps {
  className?: string;
}

export const SocialMediaFeed = ({ className }: SocialMediaFeedProps) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [trends, setTrends] = useState<SocialMediaTrend[]>([]);
  const [alerts, setAlerts] = useState<SocialMediaAlert[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | SocialMediaPost['platform']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'trends' | 'alerts'>('feed');

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

  const getPlatformIcon = (platform: SocialMediaPost['platform']) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: SocialMediaPost['platform']) => {
    switch (platform) {
      case 'twitter': return 'text-blue-500';
      case 'facebook': return 'text-blue-600';
      case 'youtube': return 'text-red-500';
      case 'instagram': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const getSentimentColor = (sentiment: SocialMediaPost['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment: SocialMediaPost['sentiment']) => {
    switch (sentiment) {
      case 'positive': return <ArrowUp className="w-3 h-3" />;
      case 'negative': return <ArrowDown className="w-3 h-3" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity: SocialMediaAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPlatform && matchesSearch;
  });

  const filteredTrends = trends.filter(trend => 
    selectedPlatform === 'all' || trend.platform === selectedPlatform
  );

  const formatEngagement = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={className}>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Social Media Feed
              </CardTitle>
              <CardDescription>
                Real-time social media monitoring for ocean hazards
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search posts, users, or hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Platform Tabs */}
          <Tabs value={selectedPlatform} onValueChange={(value: any) => setSelectedPlatform(value)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="twitter">
                <Twitter className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="facebook">
                <Facebook className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="youtube">
                <Youtube className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="instagram">
                <Instagram className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            {/* Content Tabs */}
            <div className="mt-4">
              <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="feed">Feed ({filteredPosts.length})</TabsTrigger>
                  <TabsTrigger value="trends">Trends ({filteredTrends.length})</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts ({alerts.length})</TabsTrigger>
                </TabsList>

                {/* Social Media Feed */}
                <TabsContent value="feed" className="space-y-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-4 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${getPlatformColor(post.platform)} flex-shrink-0`}>
                            {getPlatformIcon(post.platform)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{post.user}</span>
                              <span className="text-sm text-muted-foreground">{post.userHandle}</span>
                              {post.verified && (
                                <Badge variant="default" className="text-xs px-1 py-0">
                                  ✓
                                </Badge>
                              )}
                              {post.location && (
                                <Badge variant="outline" className="text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {post.location}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-foreground leading-relaxed mb-3">
                              {post.content}
                            </p>

                            {/* Media */}
                            {post.media && post.media.length > 0 && (
                              <div className="mb-3">
                                {post.media.map((media, index) => (
                                  <div key={index} className="relative">
                                    {media.type === 'image' ? (
                                      <img 
                                        src={media.url} 
                                        alt="Post media" 
                                        className="w-full max-w-sm rounded-lg"
                                      />
                                    ) : (
                                      <div className="relative w-full max-w-sm">
                                        <img 
                                          src={media.url} 
                                          alt="Video thumbnail" 
                                          className="w-full rounded-lg"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="bg-black/50 rounded-full p-2">
                                            <Play className="w-6 h-6 text-white" />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Hashtags */}
                            {post.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.hashtags.map((tag, index) => (
                                  <span key={index} className="text-xs text-blue-600 hover:underline cursor-pointer">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Engagement Stats */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  <span>{formatEngagement(post.engagement.likes)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="w-3 h-3" />
                                  <span>{formatEngagement(post.engagement.shares)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{formatEngagement(post.engagement.comments)}</span>
                                </div>
                                {post.engagement.views && (
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{formatEngagement(post.engagement.views)}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className={`flex items-center gap-1 ${getSentimentColor(post.sentiment)}`}>
                                  {getSentimentIcon(post.sentiment)}
                                  <span className="capitalize">{post.sentiment}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Trends */}
                <TabsContent value="trends" className="space-y-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTrends.map((trend) => (
                      <div
                        key={trend.id}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={getPlatformColor(trend.platform)}>
                            {getPlatformIcon(trend.platform)}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{trend.keyword}</span>
                              {trend.trending && (
                                <Badge variant="secondary" className="text-xs">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{trend.mentions.toLocaleString()}</span>
                              </div>
                              
                              {trend.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{trend.location}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{format(new Date(trend.timestamp), 'HH:mm')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-1 ${getSentimentColor(trend.sentiment)}`}>
                          {getSentimentIcon(trend.sentiment)}
                          <span className="text-xs font-medium capitalize">{trend.sentiment}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Alerts */}
                <TabsContent value="alerts" className="space-y-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 bg-secondary/30 rounded-lg border border-border/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{alert.description}</span>
                              <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <div className={getPlatformColor(alert.platform)}>
                                  {getPlatformIcon(alert.platform)}
                                </div>
                                <span>{alert.platform}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                <span>{alert.keyword}</span>
                              </div>
                              
                              {alert.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{alert.location}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{alert.mentions} mentions</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>+{alert.change}%</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Tabs>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {posts.reduce((sum, post) => sum + post.engagement.likes, 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Likes</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {trends.filter(t => t.trending).length}
              </div>
              <div className="text-xs text-muted-foreground">Trending</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length}
              </div>
              <div className="text-xs text-muted-foreground">High Alerts</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-accent">
                {posts.length}
              </div>
              <div className="text-xs text-muted-foreground">Total Posts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
