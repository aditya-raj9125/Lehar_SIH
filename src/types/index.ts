export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'official';
  avatar?: string;
}

export interface HazardReport {
  id: string;
  userId: string;
  userName: string;
  type: 'tsunami' | 'high-waves' | 'storm-surge' | 'coastal-damage' | 'unusual-tides' | 'swell-surge';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  images?: string[];
  videos?: string[];
  timestamp: string;
  verified: boolean;
  socialMediaMentions?: number;
  reporterContact?: string; // Optional contact when submitting without authentication
  reporterName?: string; // Optional name when submitting without authentication
  status?: 'received' | 'under-review' | 'verified' | 'rejected';
  source?: 'citizen' | 'official' | 'social';
}

export interface SocialMediaTrend {
  id: string;
  platform: 'twitter' | 'facebook' | 'youtube' | 'instagram';
  keyword: string;
  mentions: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  trending: boolean;
  location?: string;
  timestamp: string;
}

export interface MapHotspot {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  intensity: number;
  reportCount: number;
  dominantHazardType: HazardReport['type'];
  radius: number;
}