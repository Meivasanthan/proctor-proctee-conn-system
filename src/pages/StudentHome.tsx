import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Upload, 
  Eye, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  Award,
  Settings,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import studentIcon from "@/assets/student-icon.jpg";

const StudentHome = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, type: 'upload', message: 'New semester marks uploaded successfully', time: '2 hours ago' },
    { id: 2, type: 'view', message: 'Staff reviewed your achievement certificates', time: '1 day ago' },
    { id: 3, type: 'report', message: 'New report available from your proctor', time: '3 days ago' },
  ]);

  const quickActions = [
    { icon: Upload, label: 'Upload Documents', color: 'bg-academic-blue', action: () => {} },
    { icon: Eye, label: 'View Records', color: 'bg-academic-gold', action: () => {} },
    { icon: FileText, label: 'Semester Marks', color: 'bg-green-500', action: () => {} },
    { icon: Award, label: 'Achievements', color: 'bg-purple-500', action: () => {} },
  ];

  return (
    <div className="min-h-screen academic-pattern">
      {/* Header */}
      <header className="bg-card shadow-academic border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-academic-blue" />
            <h1 className="text-2xl font-bold text-academic-blue">Proctee Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-academic-gold">
                3
              </Badge>
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={studentIcon} alt="Student" />
                <AvatarFallback>👨‍🎓</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm">John Doe</p>
                <p className="text-xs text-muted-foreground">Reg: 2024CS001</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="shadow-academic border-0 card-gradient mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-academic-blue">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Manage your academic records efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-24 flex-col gap-2 hover:shadow-academic transition-smooth"
                      onClick={action.action}
                    >
                      <action.icon className={`h-6 w-6 text-white p-1 rounded ${action.color}`} />
                      <span className="text-xs text-center">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Academic Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="shadow-academic border-0 card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-academic-blue">8.7</p>
                      <p className="text-sm text-muted-foreground">Current CGPA</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-academic-blue/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-academic-blue" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-academic border-0 card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">0</p>
                      <p className="text-sm text-muted-foreground">Current Arrears</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-academic border-0 card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-academic-gold">5</p>
                      <p className="text-sm text-muted-foreground">Achievements</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-academic-gold/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-academic-gold" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notifications & Profile */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="shadow-academic border-0 card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-academic-blue">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-2 w-2 rounded-full bg-academic-blue mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Profile Card */}
            <Card className="shadow-academic border-0 card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-academic-blue">
                  <Settings className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={studentIcon} alt="Student" />
                  <AvatarFallback>👨‍🎓</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-muted-foreground">Register: 2024CS001</p>
                <p className="text-sm text-muted-foreground">Academic Year: 2024-2027</p>
                <Button variant="academic-outline" size="sm" className="mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;