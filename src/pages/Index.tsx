// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Shield, Users, FileText, TrendingUp, Award, BookOpen } from "lucide-react";
import RoleCard from "@/components/RoleCard";
import HomeSlideshow from "@/components/HomeSlideshow";

const Index = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'student' | 'staff') => {
    navigate('/login', { state: { role } });
  };

  const features = [
    {
      icon: FileText,
      title: "Digital Records",
      description: "Secure storage and management of academic documents"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time monitoring of academic performance and CGPA"
    },
    {
      icon: Award,
      title: "Achievement Management",
      description: "Upload and showcase academic achievements and certificates"
    },
    {
      icon: Users,
      title: "Seamless Communication",
      description: "Direct connection between proctors and proctees"
    }
  ];

  return (
    <div className="min-h-screen academic-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-green-600 p-1 rounded-lg text-white" />
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Proctor</span>
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">–</span>
                <span className="bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">Proctee</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A comprehensive digital platform connecting mentors and students for transparent academic management and progress tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="academic" size="lg" className="text-lg px-8">
                <GraduationCap className="mr-2 h-5 w-5" />
                Get Started Today
              </Button>
              <Button variant="academic-outline" size="lg" className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>

          {/* Auto Slideshow */}
          <div className="mb-16">
            <HomeSlideshow />
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-muted-foreground">
              Access the platform based on your academic position
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <RoleCard
              role="student"
              title="Proctee (Student)"
              description="Upload academic records, track progress, view reports, and manage your academic journey"
              icon="student"
              onSelect={() => handleRoleSelect('student')}
            />

            <RoleCard
              role="staff"
              title="Proctor (Staff)"
              description="Monitor student progress, generate reports, and provide academic guidance"
              icon="staff"
              onSelect={() => handleRoleSelect('staff')}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-academic-blue mb-4">
              System Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for academic management, progress tracking, and seamless communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Document Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload, organize, and track academic documents with seamless integration and secure storage.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Progress Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor CGPA, arrears, and academic achievements with real-time updates and detailed analytics.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Mentor Communication</h3>
              <p className="text-muted-foreground leading-relaxed">
                Direct communication and feedback between proctors and students for enhanced academic guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-academic-blue text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-6 w-6" />
              <span className="text-xl font-bold">Proctor–Proctee System</span>
            </div>
            <p className="text-blue-100">
              Empowering academic excellence through digital innovation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
