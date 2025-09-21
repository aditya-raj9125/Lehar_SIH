import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Users, 
  BarChart3, 
  Shield, 
  Globe,
  AlertTriangle,
  Eye,
  FileText,
  Phone
} from 'lucide-react';

import { ReportSubmissionModal } from '@/components/Reports/ReportSubmissionModal';
import { HazardReport } from '@/types';
import { WaveLogo } from '@/components/ui/WaveLogo';

const Landing = () => {
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleReportSubmit = (reportData: Partial<HazardReport>) => {
    // For landing page, we can simply close after submit. Persisting happens in Reports/Dashboard pages.
    console.log('Report submitted from Landing:', reportData);
  };

  const features = [
    {
      icon: Users,
      title: "Crowd Reporting",
      description: "Submit geotagged observations, photos, and videos via a user-friendly app."
    },
    {
      icon: MapPin,
      title: "Dynamic Maps",
      description: "Visualize live reports and social media hotspots with advanced filters."
    },
    {
      icon: BarChart3,
      title: "AI-powered insights",
      description: "Leverage NLP to monitor public sentiment and hazard trends in real time."
    },
    {
      icon: Shield,
      title: "Role-based access",
      description: "Assign user rights for citizens, officials, and analysts for tailored data access."
    },
    {
      icon: Globe,
      title: "Multilingual support",
      description: "Access the platform in multiple Indian languages for better citizen engagement."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <WaveLogo size="md" textSize="md" />
          
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

      {/* Hero Section */}
      <section className="pt-5 md:pt-6 pb-2 md:pb-3 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
              • Government of India Initiative
            </span>
          </div>
          
          <h1 className="font-bold mb-6 leading-tight tracking-tight">
            <span className="block text-4xl md:text-6xl text-foreground">
              Protecting India's <span className="text-primary">Coastal</span>
            </span>
            <span className="block text-4xl md:text-6xl text-foreground">Communities</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            <span className="block">Advanced hazard monitoring and citizen reporting system for tsunamis, cyclones, and marine emergencies</span>
            <span className="block">across India's 7,500 km coastline.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90"
              onClick={() => setIsReportModalOpen(true)}
            >
              Report Hazard Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2"
              onClick={() => navigate('/map')}
            >
              View Live Map
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-3 md:py-2 px-2 bg-secondary/30 mb-6 md:mb-2.5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-coastal transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Hotline Ticker */}
      <section className="bg-orange-500 text-white overflow-hidden">
        <div className="relative whitespace-nowrap py-2">
          <div className="inline-block pr-16 animate-emergency-ticker">
            <span className="mx-8 font-semibold">NDRF | 1800-123-4567</span>
            <span className="mx-8 font-semibold">Coast Guard | 1554</span>
            <span className="mx-8 font-semibold">Emergency | 112</span>
            <span className="mx-8 font-semibold">Disaster Management | 1070</span>
          </div>
          <div className="inline-block pr-16 animate-emergency-ticker" aria-hidden="true" style={{ animationDelay: "-5s" }}>
            <span className="mx-8 font-semibold">NDRF | 1800-123-4567</span>
            <span className="mx-8 font-semibold">Coast Guard | 1554</span>
            <span className="mx-8 font-semibold">Emergency | 112</span>
            <span className="mx-8 font-semibold">Disaster Management | 1070</span>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-10 px-2">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            Be the <span className="text-primary">Change</span>.{' '}
            <span className="text-foreground">Save Lives</span>.
          </h2>
          
          <p className="text-xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed">
            <span className="block">Your voice matters. Every report you submit helps protect thousands of coastal families.</span>
            <span className="block">Join India's largest citizen-driven disaster response network</span>
            <span className="block">and become a guardian of our coastline.</span>
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90"
            onClick={() => setIsReportModalOpen(true)}
          >
            Report Hazard Now
          </Button>
        </div>
      </section>

      {/* Report Submission Modal (opens from any Report Now button) */}
      <ReportSubmissionModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      {/* Footer */}
      <footer className="border-t bg-background/95 text-foreground py-1 px-2">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-y-1 md:gap-y-2 gap-x-6 md:gap-x-10">
            {/* Logo and Description */}
            <div className="md:col-span-1 md:pr-32 lg:pr-40">
              <div className="mb-1">
                <WaveLogo size="md" textSize="md" className="text-white" />
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
};

export default Landing;