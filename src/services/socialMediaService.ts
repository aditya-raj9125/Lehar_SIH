import { SocialMediaTrend } from '@/types';

// Extended types for more detailed social media data
export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'youtube' | 'instagram';
  user: string;
  userHandle: string;
  content: string;
  timestamp: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
  location?: string;
  hashtags: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  verified: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

export interface SocialMediaAlert {
  id: string;
  type: 'spike' | 'trending' | 'sentiment_change' | 'new_keyword';
  platform: SocialMediaPost['platform'];
  keyword: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  location?: string;
  mentions: number;
  change: number; // percentage change
}

// Mock data generators
const coastalLocations = [
  'Mumbai', 'Chennai', 'Kolkata', 'Visakhapatnam', 'Goa', 'Kochi', 
  'Puri', 'Mangalore', 'Surat', 'Bhubaneswar', 'Puducherry', 'Karwar'
];

const hazardKeywords = [
  'tsunami', 'high waves', 'storm surge', 'coastal erosion', 'flooding',
  'cyclone', 'tidal waves', 'sea level rise', 'coastal damage', 'beach erosion'
];

const socialMediaUsers = [
  { name: 'Coastal Watch India', handle: '@CoastalWatch_IN', verified: true },
  { name: 'IMD Weather', handle: '@IMDWeather', verified: true },
  { name: 'NDRF India', handle: '@NDRFHQ', verified: true },
  { name: 'Chennai Weather', handle: '@ChennaiWeather', verified: false },
  { name: 'Mumbai Coast Guard', handle: '@MumbaiCG', verified: true },
  { name: 'Goa Disaster Management', handle: '@GoaDM', verified: false },
  { name: 'Kerala Coastal Alert', handle: '@KeralaCoast', verified: false },
  { name: 'Tamil Nadu Emergency', handle: '@TNEmergency', verified: true },
  { name: 'West Bengal Weather', handle: '@WBWeather', verified: false },
  { name: 'Odisha Cyclone Alert', handle: '@OdishaAlert', verified: true }
];

const postTemplates = [
  "Unusual wave activity observed at {location}. Authorities monitoring the situation. Stay safe! #CoastalSafety #OceanAlert",
  "High waves of {height}m reported at {location} beach. Swimming activities suspended. Emergency services on standby. #HighWaves #SafetyFirst",
  "Storm surge warning issued for {location} coastline. Water levels rising rapidly. Evacuation notice for low-lying areas. #StormSurge #Emergency",
  "Coastal erosion observed at {location}. Sea wall partially damaged. Immediate attention required. #CoastalDamage #Infrastructure",
  "Cyclone alert for {location} region. Wind speeds expected to reach {speed} km/h. Prepare for heavy rainfall and flooding. #CycloneAlert #WeatherWarning",
  "Tsunami warning issued for {location} coast. Immediate evacuation recommended for coastal areas. Follow official instructions. #TsunamiAlert #Emergency",
  "Unusual tidal patterns detected near {location}. Water level {change}cm above normal. Monitoring continues. #TidalAlert #OceanMonitoring",
  "Beach erosion reported at {location}. Several meters of coastline affected. Environmental assessment underway. #BeachErosion #CoastalProtection"
];

// Generate random social media post
export const generateSocialMediaPost = (): SocialMediaPost => {
  const platforms: SocialMediaPost['platform'][] = ['twitter', 'facebook', 'youtube', 'instagram'];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const user = socialMediaUsers[Math.floor(Math.random() * socialMediaUsers.length)];
  const location = coastalLocations[Math.floor(Math.random() * coastalLocations.length)];
  const template = postTemplates[Math.floor(Math.random() * postTemplates.length)];
  
  // Replace placeholders in template
  const content = template
    .replace('{location}', location)
    .replace('{height}', (Math.floor(Math.random() * 5) + 2).toString())
    .replace('{speed}', (Math.floor(Math.random() * 50) + 80).toString())
    .replace('{change}', (Math.floor(Math.random() * 100) + 20).toString());

  const hashtags = content.match(/#\w+/g) || [];
  const sentiments: SocialMediaPost['sentiment'][] = ['positive', 'negative', 'neutral'];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

  const baseEngagement = Math.floor(Math.random() * 1000) + 100;
  const multiplier = platform === 'youtube' ? 3 : platform === 'instagram' ? 2 : 1;

  return {
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    platform,
    user: user.name,
    userHandle: user.handle,
    content,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    engagement: {
      likes: Math.floor(baseEngagement * multiplier * 0.8),
      shares: Math.floor(baseEngagement * multiplier * 0.3),
      comments: Math.floor(baseEngagement * multiplier * 0.2),
      views: platform === 'youtube' ? Math.floor(baseEngagement * multiplier * 10) : undefined
    },
    location,
    hashtags,
    sentiment,
    verified: user.verified,
    media: Math.random() > 0.7 ? [{
      type: Math.random() > 0.5 ? 'image' : 'video',
      url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`
    }] : undefined
  };
};

// Generate social media trend
export const generateSocialMediaTrend = (): SocialMediaTrend => {
  const platforms: SocialMediaTrend['platform'][] = ['twitter', 'facebook', 'youtube'];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const keyword = hazardKeywords[Math.floor(Math.random() * hazardKeywords.length)];
  const location = coastalLocations[Math.floor(Math.random() * coastalLocations.length)];
  const sentiments: SocialMediaTrend['sentiment'][] = ['positive', 'negative', 'neutral'];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

  return {
    id: `trend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    platform,
    keyword: `#${keyword.replace(/\s+/g, '')}`,
    mentions: Math.floor(Math.random() * 5000) + 100,
    sentiment,
    trending: Math.random() > 0.3,
    location,
    timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString()
  };
};

// Generate social media alert
export const generateSocialMediaAlert = (): SocialMediaAlert => {
  const alertTypes: SocialMediaAlert['type'][] = ['spike', 'trending', 'sentiment_change', 'new_keyword'];
  const platforms: SocialMediaAlert['platform'][] = ['twitter', 'facebook', 'youtube', 'instagram'];
  const severities: SocialMediaAlert['severity'][] = ['low', 'medium', 'high', 'critical'];
  
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const keyword = hazardKeywords[Math.floor(Math.random() * hazardKeywords.length)];
  const location = coastalLocations[Math.floor(Math.random() * coastalLocations.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];

  const descriptions = {
    spike: `Sudden spike in mentions of "${keyword}" on ${platform}`,
    trending: `"${keyword}" is now trending on ${platform}`,
    sentiment_change: `Sentiment shift detected for "${keyword}" on ${platform}`,
    new_keyword: `New hazard-related keyword "${keyword}" detected on ${platform}`
  };

  return {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    platform,
    keyword: `#${keyword.replace(/\s+/g, '')}`,
    severity,
    description: descriptions[type],
    timestamp: new Date().toISOString(),
    location,
    mentions: Math.floor(Math.random() * 1000) + 50,
    change: Math.floor(Math.random() * 200) + 10 // 10-210% change
  };
};

// Real-time data simulation
export class SocialMediaFeedService {
  private posts: SocialMediaPost[] = [];
  private trends: SocialMediaTrend[] = [];
  private alerts: SocialMediaAlert[] = [];
  private subscribers: ((data: { posts: SocialMediaPost[], trends: SocialMediaTrend[], alerts: SocialMediaAlert[] }) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Generate initial data
    for (let i = 0; i < 20; i++) {
      this.posts.push(generateSocialMediaPost());
    }
    
    for (let i = 0; i < 10; i++) {
      this.trends.push(generateSocialMediaTrend());
    }
    
    for (let i = 0; i < 5; i++) {
      this.alerts.push(generateSocialMediaAlert());
    }

    // Sort by timestamp (newest first)
    this.posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    this.trends.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    this.alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  subscribe(callback: (data: { posts: SocialMediaPost[], trends: SocialMediaTrend[], alerts: SocialMediaAlert[] }) => void) {
    this.subscribers.push(callback);
    
    // Start real-time updates if this is the first subscriber
    if (this.subscribers.length === 1) {
      this.startRealTimeUpdates();
    }
    
    // Send initial data
    callback({
      posts: [...this.posts],
      trends: [...this.trends],
      alerts: [...this.alerts]
    });
  }

  unsubscribe(callback: (data: { posts: SocialMediaPost[], trends: SocialMediaTrend[], alerts: SocialMediaAlert[] }) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
    
    // Stop real-time updates if no subscribers
    if (this.subscribers.length === 0) {
      this.stopRealTimeUpdates();
    }
  }

  private startRealTimeUpdates() {
    this.intervalId = setInterval(() => {
      // Randomly add new posts (30% chance every 5 seconds)
      if (Math.random() < 0.3) {
        const newPost = generateSocialMediaPost();
        this.posts.unshift(newPost);
        this.posts = this.posts.slice(0, 50); // Keep only latest 50 posts
      }

      // Randomly add new trends (20% chance every 10 seconds)
      if (Math.random() < 0.2) {
        const newTrend = generateSocialMediaTrend();
        this.trends.unshift(newTrend);
        this.trends = this.trends.slice(0, 20); // Keep only latest 20 trends
      }

      // Randomly add new alerts (10% chance every 15 seconds)
      if (Math.random() < 0.1) {
        const newAlert = generateSocialMediaAlert();
        this.alerts.unshift(newAlert);
        this.alerts = this.alerts.slice(0, 10); // Keep only latest 10 alerts
      }

      // Update engagement numbers randomly
      this.posts.forEach(post => {
        if (Math.random() < 0.1) {
          post.engagement.likes += Math.floor(Math.random() * 10);
          post.engagement.shares += Math.floor(Math.random() * 3);
          post.engagement.comments += Math.floor(Math.random() * 5);
          if (post.engagement.views) {
            post.engagement.views += Math.floor(Math.random() * 50);
          }
        }
      });

      // Update trend mentions
      this.trends.forEach(trend => {
        if (Math.random() < 0.15) {
          trend.mentions += Math.floor(Math.random() * 20);
        }
      });

      // Notify subscribers
      this.subscribers.forEach(callback => {
        callback({
          posts: [...this.posts],
          trends: [...this.trends],
          alerts: [...this.alerts]
        });
      });
    }, 5000); // Update every 5 seconds
  }

  private stopRealTimeUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Public methods for getting filtered data
  getPostsByPlatform(platform?: SocialMediaPost['platform']): SocialMediaPost[] {
    if (!platform) return [...this.posts];
    return this.posts.filter(post => post.platform === platform);
  }

  getTrendsByPlatform(platform?: SocialMediaTrend['platform']): SocialMediaTrend[] {
    if (!platform) return [...this.trends];
    return this.trends.filter(trend => trend.platform === platform);
  }

  getAlertsBySeverity(severity?: SocialMediaAlert['severity']): SocialMediaAlert[] {
    if (!severity) return [...this.alerts];
    return this.alerts.filter(alert => alert.severity === severity);
  }

  searchPosts(query: string): SocialMediaPost[] {
    const lowercaseQuery = query.toLowerCase();
    return this.posts.filter(post => 
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.user.toLowerCase().includes(lowercaseQuery) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getTrendingKeywords(): string[] {
    return this.trends
      .filter(trend => trend.trending)
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10)
      .map(trend => trend.keyword);
  }
}

// Export singleton instance
export const socialMediaService = new SocialMediaFeedService();
