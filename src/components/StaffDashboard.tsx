import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import axios from "axios";
import CameraMonitoring from "./CameraMonitoring";

interface Student {
  _id: string;
  studentId: string;
  name: string;
  regNo?: string;
  email: string;
  department: string;
  year?: number;
  section?: string;
  cgpa?: number;
  arrears?: { total: number;[key: string]: any };
  academicYear?: string;
}

interface StudentRecord {
  student?: {
    name: string;
    regNo: string;
    department: string;
  };
  studentName?: string;
  registerNo?: string;
  department?: string;
  uploads: Record<
    string,
    Array<{
      filename: string;
      originalname?: string;
      name?: string;
      url?: string;
      path?: string;
      uploadedAt?: string;
    }>
  >;
  cgpa: number | null;
  arrearStatus?: string;
  subjectArrears?: Record<string, any>;
}

const StaffDashboard = ({ staffId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reportText, setReportText] = useState("");
  const [studentRecords, setStudentRecords] = useState<StudentRecord | null>(null);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewReport, setViewReport] = useState(false);
  // const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportStudent, setReportStudent] = useState(null);
  // at top of component
  const [activeTab, setActiveTab] = useState<string>("students");




  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleViewRecordsClick = (studentId: string) => {
    setSelectedStudent(studentId);
    setViewReport(true);

    // switch to reports tab
    setActiveTab("reports");

  };


  const handleSendReport = async () => {
    if (!selectedStudent || !reportText.trim()) {
      toast({ title: "Error", description: "Please select a student and enter report text", variant: "destructive" });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/students/${selectedStudent}/reports`, { content: reportText });
      toast({ title: "Success", description: "Report sent successfully" });
      setReportText("");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to send report", variant: "destructive" });
    }
  };



  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/students/${selectedStudent}`);
        setReportStudent(res.data.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };
    fetchStudent();
  }, [selectedStudent]);

  // hardcoded staff ID

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const department = "CSE"; // You can hardcode or fetch dynamically

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${staffId || 'S001'}/students`,
          {
            params: { department },
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          setStudents(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setStudents([]);
        }
      } catch (err: any) {
        console.error("API Error:", err);
        toast({ title: "Error", description: "Failed to fetch students", variant: "destructive" });
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [staffId, toast]);

  // Fetch individual student records
  const fetchStudentRecords = async (studentId: string) => {
    if (!studentId) return;
    setLoadingRecords(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/students/${studentId}`
      );

      if (response.data && response.data.data) {
        setStudentRecords(response.data.data);
      } else {
        setStudentRecords(null);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Unable to fetch student files", variant: "destructive" });
      setStudentRecords(null);
    } finally {
      setLoadingRecords(false);
    }
  };



  const filteredStudents = students.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.regNo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderUploadGroups = (uploadsObj: StudentRecord["uploads"] = {}) => {
    const categories = Object.keys(uploadsObj);
    if (!categories.length) return <p className="text-sm text-muted-foreground">No uploads</p>;
    return (
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat} className="border rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{cat}</h4>
              <Badge>{uploadsObj[cat]?.length || 0}</Badge>
            </div>
            <div className="space-y-2">
              {(uploadsObj[cat] || []).map((f: any, idx: number) => {
                const name = f.filename || f.originalname || f.name || `file-${idx + 1}`;
                const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
                const url = f.url || f.path || (f.filename ? `${baseUrl}/uploads/${f.filename}` : null);

                const handleFileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (!url) return;
                  window.open(url, "_blank", "noopener,noreferrer");
                };

                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="truncate max-w-[70%]">
                      {url ? (
                        <a href={url} onClick={handleFileClick} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {name}
                        </a>
                      ) : (
                        <span>{name}</span>
                      )}
                    </div>
                    <div>{f.uploadedAt ? new Date(f.uploadedAt).toLocaleString() : ""}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academic-blue mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Cards */}
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
                <p className="text-2xl font-bold text-green-600">{students.filter((s) => (s.arrears?.total ?? 0) === 0).length}</p>
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
                <p className="text-2xl font-bold text-orange-600">{students.filter((s) => (s.arrears?.total ?? 0) > 0).length}</p>
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
                  {students.length ? (students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / students.length).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Student Records</TabsTrigger>
          <TabsTrigger id="reports-tab" value="reports">Generate Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="camera">Camera Monitoring</TabsTrigger>
        </TabsList>
        {/* 
        <Tabs className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Student Records</TabsTrigger>
            <TabsTrigger value="reports">Generate Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          ...
         */}

        {/* Student Records Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-academic-blue"><Users className="h-5 w-5" /> Student Records</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search students by name or register number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div key={student._id} className="p-4 border rounded-lg hover:bg-accent/50 transition-smooth">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{student.name}</h3>
                          <Badge variant="outline">{student.regNo}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Academic Year: {student.year || student.academicYear || "—"}</p>
                        <div className="flex gap-4 text-sm">
                          <span>CGPA: <span className="font-semibold text-academic-blue">{student.cgpa ?? "-"}</span></span>
                          <span>Arrears: <span className={`font-semibold ${(student.arrears?.total ?? 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>{student.arrears?.total ?? 0}</span></span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/students/${student.studentId}`)}>
                          <Eye className="h-4 w-4 mr-1" /> View Details
                        </Button>
                        <Button size="sm" variant="academic-outline" onClick={() => handleViewRecordsClick(student.studentId)}>Create Records</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Student Records */}
              {selectedStudent && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Selected Student Records</h3>
                  {loadingRecords ? <p>Loading records...</p> : studentRecords ? (
                    <div className="space-y-4">
                      <div className="p-4 border rounded">
                        <h4 className="font-semibold">Student Info</h4>
                        <p>Name: {studentRecords.student?.name || studentRecords.studentName || "—"}</p>
                        <p>Register No: {studentRecords.student?.regNo || studentRecords.registerNo || "—"}</p>
                        <p>Department: {studentRecords.student?.department || studentRecords.department || "—"}</p>
                        <p>CGPA: {studentRecords.cgpa ?? "—"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Uploads</h4>
                        {renderUploadGroups(studentRecords.uploads)}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Subject Arrears</h4>
                        <pre className="bg-gray-50 p-3 rounded text-sm">{JSON.stringify(studentRecords.subjectArrears || {}, null, 2)}</pre>
                      </div>
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No records loaded for selected student.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        {viewReport && reportStudent && (
          <Card className="p-4 bg-slate-50 border shadow-md">
            <h2 className="text-xl font-semibold mb-3">{reportStudent.name} ({reportStudent.regNo})</h2>
            <p>CGPA: {reportStudent.cgpa}</p>
            <p>Arrears: {reportStudent.arrears?.total ?? 0}</p>

            <h3 className="mt-4 font-bold text-blue-600">Achievements:</h3>
            {reportStudent.achievements?.length ? (
              <ul className="list-disc ml-6">
                {reportStudent.achievements.map((a, i) => (
                  <li key={i}>{a.type} - {a.details}</li>
                ))}
              </ul>
            ) : <p>No achievements yet</p>}

            <h3 className="mt-4 font-bold text-blue-600">Reports:</h3>
            {reportStudent.reports?.length ? (
              <ul className="list-disc ml-6">
                {reportStudent.reports.map((r, i) => (
                  <li key={i}>{r.content} <span className="text-xs text-gray-500">({new Date(r.createdAt).toLocaleString()})</span></li>
                ))}
              </ul>
            ) : <p>No reports yet</p>}

            <div className="mt-4">
              <Textarea
                placeholder="Write new report..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
              />
              <Button onClick={handleSendReport} className="mt-2 w-full">Send Report</Button>
            </div>
          </Card>
        )}


        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader><CardTitle className="text-academic-blue">Performance Analytics</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">CGPA Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>Excellent (9.0+)</span><span>{students.filter(s => s.cgpa >= 9.0).length} students</span></div>
                    <div className="flex justify-between text-sm"><span>Good (8.0-8.9)</span><span>{students.filter(s => s.cgpa >= 8.0 && s.cgpa < 9.0).length} students</span></div>
                    <div className="flex justify-between text-sm"><span>Average (7.0-7.9)</span><span>{students.filter(s => s.cgpa >= 7.0 && s.cgpa < 8.0).length} students</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Arrears Summary</h4>
                  <div className="flex gap-4 text-sm">
                    <div>Total Students with Arrears: {students.filter(s => (s.arrears?.total ?? 0) > 0).length}</div>
                    <div>Total Students without Arrears: {students.filter(s => (s.arrears?.total ?? 0) === 0).length}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Camera Monitoring Tab */}
        <TabsContent value="camera" className="space-y-4">
          <CameraMonitoring staffId={staffId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;


