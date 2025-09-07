import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, Trash2, Award, MessageSquare, BookOpen, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const { toast } = useToast();
  const [cgpaData, setCgpaData] = useState<{ [key: string]: string }>({
    sem1: "", sem2: "", sem3: "", sem4: "", sem5: "", sem6: "", sem7: "", sem8: ""
  });
  
  const [arrearStatus, setArrearStatus] = useState<{ [key: string]: boolean }>({
    sem1: false, sem2: false, sem3: false, sem4: false, 
    sem5: false, sem6: false, sem7: false, sem8: false
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
    achievements: [],
    documents: []
  });

  const handleFileUpload = (category: string, files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => ({
        ...prev,
        [category]: [...prev[category], ...newFiles]
      }));
      toast({
        title: "Files Uploaded",
        description: `${newFiles.length} file(s) uploaded successfully`,
      });
    }
  };

  const removeFile = (category: string, index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const toggleArrearStatus = (semester: string) => {
    setArrearStatus(prev => ({
      ...prev,
      [semester]: !prev[semester]
    }));
  };

  const updateCGPA = (semester: string, value: string) => {
    setCgpaData(prev => ({
      ...prev,
      [semester]: value
    }));
  };

  const calculateOverallCGPA = () => {
    const values = Object.values(cgpaData).filter(val => val && !isNaN(parseFloat(val)));
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
    return (sum / values.length).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-gradient shadow-academic">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-academic-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Overall CGPA</p>
                <p className="text-2xl font-bold text-academic-blue">{calculateOverallCGPA()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-academic">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Award className="h-8 w-8 text-academic-gold" />
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-academic-gold">{uploadedFiles.achievements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-academic">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Clear Semesters</p>
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(arrearStatus).filter(status => !status).length}/8
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="marks" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="marks">Marks & CGPA</TabsTrigger>
          <TabsTrigger value="arrears">Arrear History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="marks" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-academic-blue">
                <BookOpen className="h-5 w-5" />
                Semester-wise CGPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <div key={sem} className="space-y-2">
                    <Label htmlFor={`sem${sem}`}>Semester {sem}</Label>
                    <Input
                      id={`sem${sem}`}
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="0.00"
                      value={cgpaData[`sem${sem}`]}
                      onChange={(e) => updateCGPA(`sem${sem}`, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arrears" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="text-academic-blue">Arrear History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <div
                    key={sem}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-smooth ${
                      arrearStatus[`sem${sem}`]
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-green-500 bg-green-50 text-green-700'
                    }`}
                    onClick={() => toggleArrearStatus(`sem${sem}`)}
                  >
                    <div className="text-center">
                      <p className="font-semibold">Semester {sem}</p>
                      <Badge
                        variant={arrearStatus[`sem${sem}`] ? "destructive" : "default"}
                        className={arrearStatus[`sem${sem}`] ? "" : "bg-green-600"}
                      >
                        {arrearStatus[`sem${sem}`] ? "❌ Arrear" : "✅ Clear"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-academic-gold">
                <Award className="h-5 w-5" />
                Achievements & Certificates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="achievement-upload">Upload Achievement Files</Label>
                <Input
                  id="achievement-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('achievements', e.target.files)}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-gold file:text-white"
                />
              </div>
              
              <div className="space-y-2">
                {uploadedFiles.achievements.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile('achievements', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-academic-blue">
                <FileText className="h-5 w-5" />
                Student Information Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="document-upload">Upload Documents</Label>
                <Input
                  id="document-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('documents', e.target.files)}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-blue file:text-white"
                />
              </div>
              
              <div className="space-y-2">
                {uploadedFiles.documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile('documents', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                Staff Reports & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <p className="text-sm text-muted-foreground mb-2">Recent Report - March 2024</p>
                  <p className="text-sm">Excellent academic performance this semester. Keep up the good work and focus on improving project presentation skills.</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <p className="text-sm text-muted-foreground mb-2">Report - February 2024</p>
                  <p className="text-sm">Good progress in clearing arrears. Recommend participating in more extracurricular activities.</p>
                </div>
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">No more reports available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;