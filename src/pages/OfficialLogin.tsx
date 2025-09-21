import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WaveLogo } from '@/components/ui/WaveLogo';

export default function OfficialLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({
    email: 'admin@lehar.gov.in',
    password: 'admin123',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        navigate('/official-dashboard');
      } else {
        setError(result.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <WaveLogo size="xl" textSize="lg" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Official Portal</h1>
          <p className="text-muted-foreground text-lg">Government Official Access</p>
          <p className="text-muted-foreground text-sm mt-2">
            Ministry of Earth Sciences, Government of India
          </p>
        </div>

        <Card className="bg-white border shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Official Login</CardTitle>
            <CardDescription>
              Access the official ocean monitoring dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Official Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your official email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Demo: admin@lehar.gov.in
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Demo password: admin123
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
                  'Sign In as Official'
                )}
              </Button>
              
              <div className="text-center">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Citizen Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Secure access for government officials and authorized personnel
        </p>
      </div>
    </div>
  );
}
