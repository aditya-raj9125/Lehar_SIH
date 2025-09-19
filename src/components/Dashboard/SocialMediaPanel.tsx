import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Twitter, 
  Facebook, 
  Youtube, 
  TrendingUp, 
  MessageCircle,
  Hash,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react';
import { SocialMediaTrend } from '@/types';
import { format } from 'date-fns';

// Mock data for social media trends
const sampleTrends: SocialMediaTrend[] = [
  {
    id: '1',
    platform: 'twitter',
    keyword: '#TsunamiAlert',
    mentions: 1250,
    sentiment: 'negative',
    trending: true,
    location: 'Visakhapatnam',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    platform: 'facebook',
    keyword: 'High Waves Chennai',
    mentions: 890,
    sentiment: 'neutral',
    trending: true,
    location: 'Chennai',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    platform: 'twitter',
    keyword: '#CoastalSafety',
    mentions: 567,
    sentiment: 'positive',
    trending: false,
    location: 'Mumbai',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    platform: 'youtube',
    keyword: 'Storm Surge Goa',
    mentions: 234,
    sentiment: 'negative',
    trending: true,
    location: 'Goa',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

const mockPosts = [
  {
    id: '1',
    platform: 'twitter' as const,
    user: '@CoastalWatch_IN',
    content: 'Unusual wave patterns observed at Visakhapatnam beach. Authorities are monitoring the situation closely. Please stay away from the shore. #TsunamiAlert #CoastalSafety',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    engagement: 1250,
    location: 'Visakhapatnam',
  },
  {
    id: '2',
    platform: 'facebook' as const,
    user: 'Chennai Weather Updates',
    content: 'High waves of 4-5 meters reported along Marina Beach. Fishermen advised not to venture into sea. Emergency services on standby.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    engagement: 890,
    location: 'Chennai',
  },
  {
    id: '3',
    platform: 'youtube' as const,
    user: 'Goa Storm Alert',
    content: 'Live: Storm surge affecting Panaji coastline. Water levels rising rapidly. Local authorities have issued evacuation notice for low-lying areas.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    engagement: 456,
    location: 'Panaji',
  },
];

interface SocialMediaPanelProps {
  trends?: SocialMediaTrend[];
}

export const SocialMediaPanel = ({ trends = sampleTrends }: SocialMediaPanelProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'twitter' | 'facebook' | 'youtube'>('all');

  const filteredTrends = selectedPlatform === 'all' 
    ? trends 
    : trends.filter(trend => trend.platform === selectedPlatform);

  const getPlatformIcon = (platform: SocialMediaTrend['platform']) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: SocialMediaTrend['platform']) => {
    switch (platform) {
      case 'twitter': return 'text-blue-500';
      case 'facebook': return 'text-blue-600';
      case 'youtube': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSentimentColor = (sentiment: SocialMediaTrend['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      case 'neutral': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: SocialMediaTrend['sentiment']) => {
    switch (sentiment) {
      case 'positive': return <ArrowUp className="w-3 h-3" />;
      case 'negative': return <ArrowDown className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Social Media Monitor
        </CardTitle>
        <CardDescription>
          Real-time social media trends and hazard-related discussions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={selectedPlatform} onValueChange={(value: any) => setSelectedPlatform(value)}>
          <TabsList className="grid w-full grid-cols-4">
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
          </TabsList>

          <TabsContent value={selectedPlatform} className="space-y-4">
            {/* Trending Keywords */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Keywords
              </h4>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
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
            </div>

            {/* Recent Posts */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Recent Posts
              </h4>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {mockPosts
                  .filter(post => selectedPlatform === 'all' || post.platform === selectedPlatform)
                  .map((post) => (
                    <div
                      key={post.id}
                      className="p-3 bg-secondary/30 rounded-lg border border-border/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className={getPlatformColor(post.platform)}>
                          {getPlatformIcon(post.platform)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{post.user}</span>
                            <Badge variant="outline" className="text-xs">
                              {post.location}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-foreground leading-relaxed mb-2">
                            {post.content}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{post.engagement.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(post.timestamp), 'MMM d, HH:mm')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {filteredTrends.reduce((sum, trend) => sum + trend.mentions, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Mentions</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-warning">
                  {filteredTrends.filter(t => t.trending).length}
                </div>
                <div className="text-xs text-muted-foreground">Trending Topics</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {filteredTrends.length}
                </div>
                <div className="text-xs text-muted-foreground">Active Keywords</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};