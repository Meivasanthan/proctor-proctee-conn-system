// @ts-nocheck
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
import LoginSlideshow from "@/components/LoginSlideshow";

const departments = ["CSE", "IT", "IOT", "BME", "AGRI", "ECE", "EEE", "AIDS", "Chemical", "Civil", "CS", "MECH"];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get role from state or URL params
  const roleFromState = location.state?.role as 'student' | 'staff';
  const urlParams = new URLSearchParams(location.search);
  const roleFromUrl = urlParams.get('role') as 'student' | 'staff';
  const role = roleFromState || roleFromUrl;

  // Debug logging
  console.log("Location state:", location.state);
  console.log("Role from state:", roleFromState);
  console.log("Role from URL:", roleFromUrl);
  console.log("Final role:", role);

  // If role is not provided or invalid, redirect back to home
  if (!role || (role !== 'student' && role !== 'staff')) {
    console.error("❌ Invalid role provided:", role);
    toast({
      title: "Error",
      description: "Invalid role selected. Please choose student or staff.",
      variant: "destructive",
    });
    navigate('/');
    return null; // Don't render the component
  }

  const [formData, setFormData] = useState({
    username: '',
    registerNumber: '',
    email: '',
    password: '',
    department: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if role is available
    if (!role) {
      toast({
        title: "Error",
        description: "Role not found. Please go back and select your role.",
        variant: "destructive",
      });
      return;
    }

    // 🧩 Validation
    if (!formData.email || !formData.password || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (role === "student" && !formData.registerNumber) {
      toast({
        title: "Error",
        description: "Register number is required for students",
        variant: "destructive",
      });
      return;

    }

    console.log("Role:", role)

    try {
      // 🎯 Choose correct API endpoint
      const apiUrl = "http://localhost:5000/login";

      // 📦 Prepare request data
      const payload =
        role === "staff"
          ? {
            email: formData.email,
            password: formData.password,
            department: formData.department,
            role: role

          }
          : {
            email: formData.email,
            password: formData.password,
            registerNumber: formData.registerNumber,
            department: formData.department,
            role: role
          };

      console.log("Payload:", payload)

      // 🚀 Send POST request
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Data:", data)

      if (!data.success) {
        toast({
          title: "Login Failed",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      // 🎉 Success
      toast({
        title: "Login Successful!",
        // description: `Welcome ${data.user.name || formData.username}`,
      });

      // Store both token and profile in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("profile", JSON.stringify(data.user));

      // 🧭 Navigate after 1.5 seconds
      setTimeout(() => {
        navigate(role === "student" ? "/student-home" : "/staff-home", {
          state: {
            userData: data.user,
            role: role
          },
        });
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Server Error",
        description: "Unable to connect. Please try again later.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen login-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-xl font-bold mb-3 text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <LoginSlideshow />

        <Card className="shadow-elevated border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full overflow-hidden shadow-academic">
              <img src={role === 'student' ? studentIcon : staffIcon} alt={`${role} icon`} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              {role === 'student' ? (
                <GraduationCap className="h-6 w-6 text-gradient-green" />
              ) : (
                <Users className="h-6 w-6 text-gradient-green" />
              )}
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent">
                {role === 'student' ? 'Proctee Login' : 'Proctor Login'}
              </CardTitle>
            </div>
            <CardDescription>
              {role === 'student' ? 'Access your academic records and progress' : 'Manage and monitor student records'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2"><User className="h-4 w-4" /> Username</Label>
                <Input id="username" type="text" placeholder="Enter your username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
              </div>

              {role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="registerNumber" className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Register Number</Label>
                  <Input id="registerNumber" type="text" placeholder="Enter your register number" value={formData.registerNumber} onChange={e => setFormData({ ...formData, registerNumber: e.target.value })} required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email ID</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select id="department" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full border rounded p-2">
                  <option value="">Select Department</option>
                  {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2"><Lock className="h-4 w-4" /> Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
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
