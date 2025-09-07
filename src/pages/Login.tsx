import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, GraduationCap, Users, Mail, Lock, User, CreditCard, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import studentIcon from "@/assets/student-icon.jpg";
import staffIcon from "@/assets/staff-icon.jpg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const role = location.state?.role as 'student' | 'staff';

  const [formData, setFormData] = useState({
    username: '',
    registerNumber: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (role === 'student' && !formData.registerNumber) {
      toast({
        title: "Error", 
        description: "Register number is required for students",
        variant: "destructive"
      });
      return;
    }

    // Simulate login success
    toast({
      title: "Login Successful!",
      description: "Welcome to the Proctor-Proctee System",
    });

    // Navigate to appropriate home page
    setTimeout(() => {
      navigate(role === 'student' ? '/student-home' : '/staff-home');
    }, 1500);
  };

  if (!role) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen academic-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-academic-blue hover:text-academic-blue-dark"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-elevated border-0 card-gradient">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full overflow-hidden shadow-academic">
              <img
                src={role === 'student' ? studentIcon : staffIcon}
                alt={`${role} icon`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              {role === 'student' ? (
                <GraduationCap className="h-6 w-6 text-academic-blue" />
              ) : (
                <Users className="h-6 w-6 text-academic-blue" />
              )}
              <CardTitle className="text-2xl font-bold text-academic-blue">
                {role === 'student' ? 'Proctee Login' : 'Proctor Login'}
              </CardTitle>
            </div>
            <CardDescription>
              {role === 'student' 
                ? 'Access your academic records and progress'
                : 'Manage and monitor student records'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              {role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="registerNumber" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Register Number
                  </Label>
                  <Input
                    id="registerNumber"
                    type="text"
                    placeholder="Enter your register number"
                    value={formData.registerNumber}
                    onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email ID
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="academic" className="w-full mt-6">
                Login as {role === 'student' ? 'Proctee' : 'Proctor'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;