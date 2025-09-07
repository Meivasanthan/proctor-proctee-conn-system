import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Eye, 
  FileText, 
  BarChart3, 
  Bell, 
  Settings,
  LogOut,
  Search,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import staffIcon from "@/assets/staff-icon.jpg";

const StaffHome = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, message: 'Student John Doe uploaded new documents', time: '1 hour ago' },
    { id: 2, message: 'CGPA update required for Semester 3', time: '3 hours ago' },
    { id: 3, message: 'Monthly report generation due', time: '1 day ago' },
  ]);

  const students = [
    { id: 1, name: 'John Doe', regno: '2024CS001', cgpa: 8.7, arrears: 0, status: 'good' },
    { id: 2, name: 'Jane Smith', regno: '2024CS002', cgpa: 7.8, arrears: 1, status: 'attention' },
    { id: 3, name: 'Mike Johnson', regno: '2024CS003', cgpa: 9.1, arrears: 0, status: 'excellent' },
    { id: 4, name: 'Sarah Wilson', regno: '2024CS004', cgpa: 6.9, arrears: 2, status: 'concern' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-academic-blue';
      case 'attention': return 'bg-academic-gold';
      case 'concern': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen academic-pattern">
      {/* Header */}
      <header className="bg-card shadow-academic border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-academic-blue" />
            <h1 className="text-2xl font-bold text-academic-blue">Proctor Dashboard</h1>
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
                <AvatarImage src={staffIcon} alt="Staff" />
                <AvatarFallback>👨‍🏫</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm">Dr. Smith</p>
                <p className="text-xs text-muted-foreground">Computer Science Dept.</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="shadow-academic border-0 card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-academic-blue">24</p>
                      <p className="text-sm text-muted-foreground">Total Proctees</p>
                    </div>
                    <Users className="h-8 w-8 text-academic-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-academic border-0 card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-academic-gold">8.2</p>
                      <p className="text-sm text-muted-foreground">Average CGPA</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-academic-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-academic border-0 card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">18</p>
                      <p className="text-sm text-muted-foreground">No Arrears</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student List */}
            <Card className="shadow-academic border-0 card-gradient">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-academic-blue">Student Overview</CardTitle>
                    <CardDescription>Monitor and manage your proctees</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(student.status)}`} />
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.regno}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="font-semibold text-academic-blue">{student.cgpa}</p>
                          <p className="text-xs text-muted-foreground">CGPA</p>
                        </div>
                        <div className="text-center">
                          <p className={`font-semibold ${student.arrears > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {student.arrears}
                          </p>
                          <p className="text-xs text-muted-foreground">Arrears</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="academic-outline" size="sm">
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="shadow-academic border-0 card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-academic-blue">
                  <Bell className="h-5 w-5" />
                  Recent Updates
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

            {/* Quick Actions */}
            <Card className="shadow-academic border-0 card-gradient">
              <CardHeader>
                <CardTitle className="text-academic-blue">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="academic" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="academic-outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Profile */}
            <Card className="shadow-academic border-0 card-gradient">
              <CardContent className="p-6 text-center">
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarImage src={staffIcon} alt="Staff" />
                  <AvatarFallback>👨‍🏫</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">Dr. Smith</h3>
                <p className="text-sm text-muted-foreground">Computer Science</p>
                <p className="text-sm text-muted-foreground">Department</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffHome;