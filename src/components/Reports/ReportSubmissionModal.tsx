import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Camera, 
  Upload, 
  AlertTriangle, 
  Loader2,
  CheckCircle,
  X 
} from 'lucide-react';
import { HazardReport } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ReportSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (report: Partial<HazardReport>) => void;
  prefilledLocation?: { lat: number; lng: number; address?: string };
}

export const ReportSubmissionModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  prefilledLocation 
}: ReportSubmissionModalProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address: string } | null>(
    prefilledLocation ? {
      lat: prefilledLocation.lat,
      lng: prefilledLocation.lng,
      address: prefilledLocation.address || 'Selected location'
    } : null
  );
  const [formData, setFormData] = useState({
    type: '' as HazardReport['type'],
    title: '',
    description: '',
    severity: '' as HazardReport['severity'],
    images: [] as File[],
    reporterContact: '',
  });
  const [locationError, setLocationError] = useState('');
  const [duplicateReports, setDuplicateReports] = useState<HazardReport[]>([]);

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami', icon: '🌊' },
    { value: 'high-waves', label: 'High Waves', icon: '🏄' },
    { value: 'storm-surge', label: 'Storm Surge', icon: '🌪️' },
    { value: 'coastal-damage', label: 'Coastal Damage', icon: '🏗️' },
    { value: 'unusual-tides', label: 'Unusual Tides', icon: '🌀' },
    { value: 'swell-surge', label: 'Swell Surge', icon: '〰️' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-500', description: 'Minor concern, monitoring advised' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Noticeable impact, caution needed' },
    { value: 'high', label: 'High', color: 'bg-orange-500', description: 'Significant threat, immediate attention' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500', description: 'Extreme danger, emergency response' },
  ];

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      if (!res.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude).then((address) => {
            setCurrentLocation({ lat: latitude, lng: longitude, address });
          });
          setLocationError('');
        },
        (error) => {
          setLocationError('Unable to get location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const haversineKm = (a: {lat:number;lng:number}, b: {lat:number;lng:number}) => {
    const toRad = (x:number) => x * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const checkDuplicates = (candidate: Partial<HazardReport>) => {
    try {
      const raw = localStorage.getItem('hazardReports');
      const list: HazardReport[] = raw ? JSON.parse(raw) : [];
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      const near = list.filter(r => {
        if (!candidate.location || !candidate.type) return false;
        const dist = haversineKm(
          { lat: r.location.lat, lng: r.location.lng },
          { lat: candidate.location.lat!, lng: candidate.location.lng! }
        );
        const recent = new Date(r.timestamp).getTime() >= twoHoursAgo;
        return dist <= 0.2 && recent && r.type === candidate.type;
      });
      setDuplicateReports(near.slice(0, 5));
    } catch {
      setDuplicateReports([]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, 5) // Max 5 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentLocation) {
      setLocationError('Location is required. Please get your current location or select on map.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportData: Partial<HazardReport> = {
        userId: user?.id || '',
        userName: user?.name || 'Anonymous',
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location: currentLocation,
        severity: formData.severity,
        timestamp: new Date().toISOString(),
        verified: false,
        images: formData.images.map((_, index) => `image_${Date.now()}_${index}.jpg`), // Mock file names
        reporterContact: user ? undefined : formData.reporterContact,
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const raw = localStorage.getItem('hazardReports');
        const list: HazardReport[] = raw ? JSON.parse(raw) : [];
        const persisted: HazardReport = {
          id: Date.now().toString(),
          userId: reportData.userId || '',
          userName: reportData.userName || 'Anonymous',
          type: reportData.type!,
          title: reportData.title || '',
          description: reportData.description || '',
          location: reportData.location!,
          severity: reportData.severity!,
          timestamp: reportData.timestamp!,
          verified: false,
          images: reportData.images || [],
          reporterContact: reportData.reporterContact,
          status: 'received',
          source: user ? 'citizen' : 'citizen',
        };
        localStorage.setItem('hazardReports', JSON.stringify([persisted, ...list]));
        onSubmit(reportData);
      } catch {
        onSubmit(reportData);
      }
      onClose();
      
      // Reset form
      setFormData({
        type: '' as HazardReport['type'],
        title: '',
        description: '',
        severity: '' as HazardReport['severity'],
        images: [],
        reporterContact: '',
      });
      setCurrentLocation(null);
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Report Ocean Hazard
          </DialogTitle>
          <DialogDescription>
            Help protect coastal communities by reporting ocean-related hazards you observe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact info for guests */}
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="contact">Your Contact (Phone or Email)</Label>
              <Input
                id="contact"
                type="text"
                placeholder="Enter phone number or email"
                value={formData.reporterContact}
                onChange={(e) => setFormData(prev => ({ ...prev, reporterContact: e.target.value }))}
                required={!user}
              />
              <p className="text-xs text-muted-foreground">Required if not signed in, for follow-up by officials.</p>
            </div>
          )}
          {/* Location Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Location</Label>
            
            {currentLocation ? (
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <CheckCircle className="w-4 h-4 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Location Captured</p>
                  <p className="text-xs text-muted-foreground">{currentLocation.address}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentLocation(null)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { getCurrentLocation(); }}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Current Location
                </Button>
                {locationError && (
                  <Alert variant="destructive">
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-muted-foreground">
                  Accurate location helps emergency responders react faster
                </p>
              </div>
            )}
          </div>

          {/* Hazard Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Hazard Type</Label>
            <Select value={formData.type} onValueChange={(value: HazardReport['type']) => {
              setFormData(prev => ({ ...prev, type: value }));
              if (currentLocation) checkDuplicates({ type: value, location: currentLocation });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of hazard" />
              </SelectTrigger>
              <SelectContent>
                {hazardTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Potential Duplicates */}
          {duplicateReports.length > 0 && (
            <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
              <p className="text-sm font-medium">Similar recent reports nearby</p>
              <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                {duplicateReports.map(d => (
                  <li key={d.id}>{d.title} — {d.location.address}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Severity Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Severity Level</Label>
            <div className="grid grid-cols-2 gap-2">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: level.value as HazardReport['severity'] }))}
                  className={`p-3 rounded-lg border transition-colors text-left ${
                    formData.severity === level.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                    <span className="font-medium">{level.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                placeholder="Brief title for the hazard (e.g., 'High waves at Marina Beach')"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of what you observed. Include time, conditions, and any immediate effects..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Photos/Videos (Optional)</Label>
            
            <div className="space-y-2">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*,video/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('images')?.click()}
                disabled={formData.images.length >= 5}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                {formData.images.length === 0 ? 'Add Photos/Videos' : `Add More (${formData.images.length}/5)`}
              </Button>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-xs text-muted-foreground text-center p-2">
                          {file.name.slice(0, 10)}...
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Visual evidence helps authorities assess the situation quickly
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-ocean hover:shadow-ocean"
              disabled={isSubmitting || !formData.type || !formData.severity || !formData.title || !currentLocation}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};