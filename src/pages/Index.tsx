import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Shield, Users, FileText, TrendingUp, Award } from "lucide-react";
import AcademicCarousel from "@/components/AcademicCarousel";
import RoleCard from "@/components/RoleCard";

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
              <Shield className="h-12 w-12 text-academic-blue" />
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-academic-blue">Proctor</span>
                <span className="text-academic-gold">–</span>
                <span className="text-academic-blue">Proctee</span>
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

          {/* Carousel */}
          <div className="mb-16">
            <AcademicCarousel />
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-academic-blue mb-4">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-academic-blue mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for academic management, progress tracking, and seamless communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl shadow-academic card-gradient transition-smooth hover:shadow-elevated"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-academic-blue/10">
                  <feature.icon className="h-8 w-8 text-academic-blue" />
                </div>
                <h3 className="text-xl font-semibold text-academic-blue mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
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
