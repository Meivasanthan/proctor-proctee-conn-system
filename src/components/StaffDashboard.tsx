import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, MessageSquare, Search, Send, Eye, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StaffDashboard = () => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [reportText, setReportText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock student data
  const students = [
    { id: "1", name: "John Doe", regNo: "21CS001", year: "2024-2027", cgpa: 8.5, arrears: 0 },
    { id: "2", name: "Jane Smith", regNo: "21CS002", year: "2024-2027", cgpa: 9.2, arrears: 1 },
    { id: "3", name: "Mike Johnson", regNo: "21CS003", year: "2024-2027", cgpa: 7.8, arrears: 2 },
    { id: "4", name: "Sarah Wilson", regNo: "21CS004", year: "2024-2027", cgpa: 9.0, arrears: 0 },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReport = () => {
    if (!selectedStudent || !reportText.trim()) {
      toast({
        title: "Error",
        description: "Please select a student and enter report text",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report Sent",
      description: `Report sent to ${students.find(s => s.id === selectedStudent)?.name}`,
    });
    
    setReportText("");
    setSelectedStudent("");
  };

  const getStudentDetails = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-gradient shadow-academic">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-academic-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-academic-blue">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-academic">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">No Arrears</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.arrears === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-academic">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">With Arrears</p>
                <p className="text-2xl font-bold text-orange-600">
                  {students.filter(s => s.arrears > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-academic">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-8 w-8 text-academic-gold" />
              <div>
                <p className="text-sm text-muted-foreground">Avg CGPA</p>
                <p className="text-2xl font-bold text-academic-gold">
                  {(students.reduce((acc, s) => acc + s.cgpa, 0) / students.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Student Records</TabsTrigger>
          <TabsTrigger value="reports">Generate Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-academic-blue">
                <Users className="h-5 w-5" />
                Student Records
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students by name or register number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-smooth">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{student.name}</h3>
                          <Badge variant="outline">{student.regNo}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Academic Year: {student.year}</p>
                        <div className="flex gap-4 text-sm">
                          <span>CGPA: <span className="font-semibold text-academic-blue">{student.cgpa}</span></span>
                          <span>Arrears: <span className={`font-semibold ${student.arrears > 0 ? 'text-red-600' : 'text-green-600'}`}>{student.arrears}</span></span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="academic-outline">
                          View Records
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-academic-blue">
                <MessageSquare className="h-5 w-5" />
                Generate Student Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-select">Select Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.regNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStudent && (
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-sm mb-2">Student Details:</h4>
                  {(() => {
                    const student = getStudentDetails(selectedStudent);
                    return student ? (
                      <div className="text-sm text-muted-foreground">
                        <p>Name: {student.name}</p>
                        <p>Register No: {student.regNo}</p>
                        <p>CGPA: {student.cgpa}</p>
                        <p>Arrears: {student.arrears}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="report-text">Report Content</Label>
                <Textarea
                  id="report-text"
                  placeholder="Enter your report and feedback for the student..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  rows={6}
                />
              </div>

              <Button onClick={handleSendReport} variant="academic" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Report to Student
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="text-academic-blue">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">CGPA Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Excellent (9.0+)</span>
                      <span>{students.filter(s => s.cgpa >= 9.0).length} students</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Good (8.0-8.9)</span>
                      <span>{students.filter(s => s.cgpa >= 8.0 && s.cgpa < 9.0).length} students</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average (7.0-7.9)</span>
                      <span>{students.filter(s => s.cgpa >= 7.0 && s.cgpa < 8.0).length} students</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Arrear Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>No Arrears</span>
                      <span className="text-green-600">{students.filter(s => s.arrears === 0).length} students</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>1-2 Arrears</span>
                      <span className="text-orange-600">{students.filter(s => s.arrears >= 1 && s.arrears <= 2).length} students</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>3+ Arrears</span>
                      <span className="text-red-600">{students.filter(s => s.arrears > 2).length} students</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;