import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, FileText, TrendingUp, Award, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AcademicCarousel from "@/components/AcademicCarousel";
import ProfileSection from "@/components/ProfileSection";
import StudentDashboard from "@/components/StudentDashboard";

const StudentHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen academic-pattern">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-academic-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <h1 className="text-xl font-bold text-academic-blue">Proctor-Proctee System</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-academic-blue mb-2">Welcome, Proctee! 🎓</h2>
          <p className="text-muted-foreground">Access your academic records and track your progress</p>
        </div>

        {/* Carousel */}
        <div className="mb-8">
          <AcademicCarousel />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <ProfileSection 
              role="student" 
              username="John Doe" 
              registerNumber="21CS001"
              academicYear="2024-2027"
            />
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-3">
            <StudentDashboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentHome;