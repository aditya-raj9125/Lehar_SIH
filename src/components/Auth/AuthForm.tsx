import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Removed Select import as role selection is no longer needed
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Waves, AlertCircle, Loader2, MapPin, FileText, Phone } from 'lucide-react';
import { ReportSubmissionModal } from '@/components/Reports/ReportSubmissionModal';
import { HazardReport } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

export const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab as 'login' | 'register');

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const tab = p.get('tab') === 'register' ? 'register' : 'login';
    setActiveTab(tab as 'login' | 'register');
  }, [location.search]);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as User['role'],
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(
        registerData.name,
        registerData.email,
        registerData.password,
        (registerData.role || 'citizen')
      );
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header (same as Landing) */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-ocean rounded"></div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LEHAR</h1>
              <p className="text-xs text-muted-foreground">Ocean Hazard Reporting System</p>
            </div>
          </div>
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

      {/* Main auth card */}
      <main className="flex-1 p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-white border shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to access the ocean monitoring dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Demo: citizen@test.com
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Demo password: password
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-ocean hover:shadow-ocean"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/official-login')}
                      className="w-full"
                    >
                      Login as Official
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>

                  

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-ocean hover:shadow-ocean"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground text-sm mt-6">
          Protecting India's coastline through community reporting and early warning systems
        </p>
      </div>
      </main>

      {/* Report Modal */}
      <ReportSubmissionModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={(r: Partial<HazardReport>) => { console.log('Report from Auth:', r); }}
      />

      {/* Footer (same as Landing) */}
      <footer className="border-t bg-background/95 text-foreground py-1 px-2">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-y-1 md:gap-y-2 gap-x-6 md:gap-x-10">
            {/* Logo and Description */}
            <div className="md:col-span-1 md:pr-32 lg:pr-40">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <div>
                  <h3 className="text-xl font-bold">LEHAR</h3>
                </div>
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