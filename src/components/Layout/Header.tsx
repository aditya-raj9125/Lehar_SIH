import { Bell, Search, MapPin, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export const Header = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentLocation, setCurrentLocation] = useState<string>('Getting location...');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding - in real app, use a geocoding service
          setCurrentLocation('Visakhapatnam, Andhra Pradesh');
        },
        () => {
          setCurrentLocation('Location unavailable');
        }
      );
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Search and Location */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search reports, locations, or keywords..."
              className="pl-10 bg-secondary/50 border-secondary"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{currentLocation}</span>
          </div>
        </div>

        {/* Right: Status and Notifications */}
        <div className="flex items-center space-x-4">
          {/* Online/Offline Status */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-success" />
                <span className="text-sm text-success">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">Offline</span>
              </>
            )}
          </div>

          {/* Active Alerts */}
          <Badge variant="destructive" className="animate-pulse">
            2 Active Alerts
          </Badge>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs bg-destructive">
              3
            </Badge>
          </Button>

          {/* User Role Badge */}
          <Badge 
            variant={user?.role === 'citizen' ? 'secondary' : 'default'} 
            className="capitalize"
          >
            {user?.role}
          </Badge>
        </div>
      </div>
    </header>
  );
};