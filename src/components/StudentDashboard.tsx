import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Trash2,
  Award,
  MessageSquare,
  TrendingUp,
  Download,
  Printer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ArrearDetail {
  courseName: string;
  courseCode: string;
}

const StudentDashboard = ({ userData }) => {
  const BASE_URL = "http://localhost:5000";
  const profiles = userData;
  console.log("Profilesss:", profiles)


  const { toast } = useToast();




  // === CGPA & GPA ===
  const [cgpaData, setCgpaData] = useState<{ [key: string]: string }>({});
  const [gpaData, setGpaData] = useState<{ [key: string]: string }>({});

  // === Arrear Data ===
  const [arrearStatus, setArrearStatus] = useState<{ [key: string]: boolean }>({});
  const [arrearDetails, setArrearDetails] = useState<{ [key: string]: ArrearDetail[] }>({});

  // === Uploaded Files ===
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
    achievements: [],
    extra: [],
    co: [],
    internship: [],
    events: [],
    onlinecourse: [],
    nptel: [],
    documents: [],
    leaveLetters: [],
    odLetters: [],
  });
  const [selectedFile, setSelectedFile] = useState([]);
  const [uploadData, setUploadData] = useState({ details: "" });


  // === Leave & OD Forms ===
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    leaveLetter: null as File | null,
    medicalCertificate: null as File | null,
  });

  const [odForm, setOdForm] = useState({
    eventName: "",
    collegeName: "",
    startDate: "",
    endDate: "",
    file: null as File | null,
  });

  // === Student Profile Data ===
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    bloodGroup: "",
    community: "",
    religion: "",
    nationality: "",
    permanentAddress: "",
    temporaryAddress: "",
    phone: "",
    aadhaar: "",
    pan: "",
    aapar: "",
    seatType: "",
    busType: "",
    busNumber: "",
    busRoute: "",
    tenthSchool: "",
    tenthMarks: "",
    tenthPercentage: "",
    twelfthSchool: "",
    twelfthMarks: "",
    twelfthPercentage: "",
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",
    motherName: "",
    motherOccupation: "",
    motherPhone: "",
  });

  useEffect(() => {
    setProfile({
      name: "",
      dob: "",
      bloodGroup: "",
      community: "",
      religion: "",
      nationality: "",
      permanentAddress: "",
      temporaryAddress: "",
      phone: "",
      aadhaar: "",
      pan: "",
      aapar: "",
      seatType: "",
      busType: "",
      busNumber: "",
      busRoute: "",
      tenthSchool: "",
      tenthMarks: "",
      tenthPercentage: "",
      twelfthSchool: "",
      twelfthMarks: "",
      twelfthPercentage: "",
      fatherName: "",
      fatherOccupation: "",
      fatherPhone: "",
      motherName: "",
      motherOccupation: "",
      motherPhone: "",
    });
  }, []);

  // === Helpers & Handlers ===
  const handleFileUpload = (category: string, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), ...newFiles],
    }));
    toast({
      title: "Files Uploaded",
      description: `${newFiles.length} file(s) uploaded successfully.`,
    });

  };

  // const removeFile = (category: string, index: number) => {
  //   setUploadedFiles((prev) => ({
  //     ...prev,
  //     [category]: prev[category].filter((_, i) => i !== index),
  //   }));
  // };

  const toggleArrearStatus = (sem: string) => {
    setArrearStatus((prev) => ({ ...prev, [sem]: !prev[sem] }));
  };

  const addArrearCourse = (sem: string) => {
    setArrearDetails((prev) => ({
      ...prev,
      [sem]: [...(prev[sem] || []), { courseName: "", courseCode: "" }],
    }));
  };

  const updateArrearDetail = (
    sem: string,
    idx: number,
    field: keyof ArrearDetail,
    value: string
  ) => {
    const updated = [...(arrearDetails[sem] || [])];
    updated[idx][field] = value;
    setArrearDetails((prev) => ({ ...prev, [sem]: updated }));
  };

  const removeArrearCourse = (sem: string, idx: number) => {
    const updated = [...(arrearDetails[sem] || [])];
    updated.splice(idx, 1);
    setArrearDetails((prev) => ({ ...prev, [sem]: updated }));
  };
  const saveArrearDetails = async (semKey) => {
    const semester = semKey.replace("sem", "");
    const courses = arrearDetails[semKey] || [];

    if (courses.length === 0) {
      toast({
        title: "No courses added",
        description: `Please add at least one arrear course for Semester ${semester}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        email: profiles.email, // ✅ Identify student by email
        semester,
        courses,
      };

      const res = await fetch(`${BASE_URL}/student/arrears`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Arrear Saved ✅",
          description: `Semester ${semester} arrears saved successfully.`,
        });
      } else {
        toast({
          title: data.message,
          description: data.error || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error saving arrear:", err);
      toast({
        title: "Network Error ⚠️",
        description: "Could not connect to backend.",
        variant: "destructive",
      });
    }
  };


  const updateCGPA = (sem: string, val: string) =>
    setCgpaData((prev) => ({ ...prev, [sem]: val }));

  const updateGPA = (sem: string, val: string) =>
    setGpaData((prev) => ({ ...prev, [sem]: val }));

  const calculateOverall = (data: { [key: string]: string }) => {
    const values = Object.values(data).filter((v) => v && !isNaN(parseFloat(v)));
    if (values.length === 0) return "0.00";
    const total = values.reduce((a, b) => a + parseFloat(b), 0);
    return (total / values.length).toFixed(2);
  };

  // Profile change handler with percentage auto-calc
  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => {
      const updated: typeof profile = { ...prev, [field]: value };

      if (field === "tenthMarks") {
        const marks = parseFloat(value);
        updated.tenthPercentage = isNaN(marks) ? "" : ((marks / 500) * 100).toFixed(2);
      }

      if (field === "twelfthMarks") {
        const marks = parseFloat(value);
        updated.twelfthPercentage = isNaN(marks) ? "" : ((marks / 600) * 100).toFixed(2);
      }

      // when switching busType to outbus/college, keep aapar or bus fields intact (no wipe)
      return updated;
    });
  };

  // Leave & OD handlers

  const handleDocumentsUpload = async () => {
    try {
      const formData = new FormData();

      if (uploadedFiles.documents.length === 0) {
        toast({
          title: "No files selected",
          description: "Please choose at least one document to upload.",
          variant: "destructive",
        });
        return;
      }
      formData.append("email", profiles.email); // Student email (unique ID)


      uploadedFiles.documents.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`${BASE_URL}/student/documents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Documents upload failed");

      const data = await response.json();
      toast({
        title: "Documents Uploaded ✅",
        description: `${uploadedFiles.documents.length} documents saved successfully.`,
      });

      console.log("Documents uploaded:", data);

      setUploadedFiles((prev) => ({ ...prev, documents: [] }));
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Upload Failed ❌",
        description: "Something went wrong while uploading documents.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveSubmit = async () => {
    try {
      if (!leaveForm.leaveLetter) {
        toast({
          title: "Error",
          description: "Please upload a leave letter.",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("email", profiles.email); // Student email (unique ID)

      formData.append("type", leaveForm.leaveType);
      formData.append("from", leaveForm.startDate);
      formData.append("to", leaveForm.endDate);
      formData.append("reason", leaveForm.reason);
      formData.append("letter", leaveForm.leaveLetter);
      if (leaveForm.medicalCertificate)
        formData.append("medical", leaveForm.medicalCertificate);

      const response = await fetch(`${BASE_URL}/student/leaves`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Leave upload failed");

      const data = await response.json();
      console.log("Leave uploaded:", data);

      toast({
        title: "Leave Submitted ✅",
        description: "Leave application uploaded successfully.",
      });

      setLeaveForm({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        leaveLetter: null,
        medicalCertificate: null,
      });
    } catch (error) {
      console.error("Error uploading leave:", error);
      toast({
        title: "Upload Failed ❌",
        description: "Something went wrong while uploading leave application.",
        variant: "destructive",
      });
    }
  };


  const handleOdSubmit = async () => {
    try {
      if (!odForm.file) {
        toast({
          title: "Error",
          description: "Please upload an OD letter.",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("email", profiles.email); // Student email (unique ID)

      formData.append("eventName", odForm.eventName);
      formData.append("collegeName", odForm.collegeName);
      formData.append("from", odForm.startDate);
      formData.append("to", odForm.endDate);
      formData.append("odLetter", odForm.file);

      const response = await fetch(`${BASE_URL}/student/onduty`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("OD upload failed");

      const data = await response.json();
      console.log("OD uploaded:", data);

      toast({
        title: "OD Submitted ✅",
        description: "On-Duty application uploaded successfully.",
      });

      setOdForm({
        eventName: "",
        collegeName: "",
        startDate: "",
        endDate: "",
        file: null,
      });
    } catch (error) {
      console.error("Error uploading OD:", error);
      toast({
        title: "Upload Failed ❌",
        description: "Something went wrong while uploading OD application.",
        variant: "destructive",
      });
    }
  };
  console.log("Profilefff State:", profile)

  // Download & Print
  const handleDownload = () => {
    toast({ title: "Download", description: "Preparing your report for download..." });
  };

  const handlePrint = () => {
    window.print();
  };

  // Persist profile in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("studentProfile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const handleSaveProfile = async () => {
    try {
      // ✅ Create the full payload correctly matching StudentSchema
      const studentData = {
        // --- Basic student account details ---
        studentId: profiles?.studentId,
        name: profile.name,
        email: profiles?.email,
        password: profiles?.password,
        department: profiles?.department,
        year: profiles?.year,
        section: profiles?.section,

        // --- Basic personal info ---
        basic: {
          name: profile.name,
          dob: profile.dob,
          bloodGroup: profile.bloodGroup,
          community: profile.community,
          religion: profile.religion,
          nationality: profile.nationality,
          permanentAddress: profile.permanentAddress,
          temporaryAddress: profile.temporaryAddress,
          phoneNumber: profile.phone,
          aadharNumber: profile.aadhaar,
          panNumber: profile.pan,
          aaparId: profile.aapar,
          seatType: profile.seatType,
          busType: profile.busType,
          busNumber: profile.busNumber,
          busRoute: profile.busRoute,
        },

        // --- Parents info ---
        father: {
          name: profile.fatherName,
          occupation: profile.fatherOccupation,
          phone: profile.fatherPhone,
        },
        mother: {
          name: profile.motherName,
          occupation: profile.motherOccupation,
          phone: profile.motherPhone,
        },

        // --- School info ---
        school: {
          tenth: {
            name: profile.tenthSchool,
            mark: profile.tenthMarks,
            percentage: profile.tenthPercentage,
          },
          twelfth: {
            name: profile.twelfthSchool,
            mark: profile.twelfthMarks,
            percentage: profile.twelfthPercentage,
          },
        },
      };


      console.log("Student Data :-", studentData)
      const response = await fetch(`${BASE_URL}/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) throw new Error("Failed to save profile");

      const data = await response.json();
      console.log("Profile saved to backend:", data);

      if (data) {
        toast({
          title: data.message,
          description: data.message,
        });

        setProfile({
          name: "",
          dob: "",
          bloodGroup: "",
          community: "",
          religion: "",
          nationality: "",
          permanentAddress: "",
          temporaryAddress: "",
          phone: "",
          aadhaar: "",
          pan: "",
          aapar: "",
          seatType: "",
          busType: "",
          busNumber: "",
          busRoute: "",
          tenthSchool: "",
          tenthMarks: "",
          tenthPercentage: "",
          twelfthSchool: "",
          twelfthMarks: "",
          twelfthPercentage: "",
          fatherName: "",
          fatherOccupation: "",
          fatherPhone: "",
          motherName: "",
          motherOccupation: "",
          motherPhone: "",
        });
      }

    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save Failed ❌",
        description: "Something went wrong while saving your profile.",
        variant: "destructive",
      });
    }
  };


  // Marks and CGPA

  const handleSaveMarks = async (semester) => {
    const semKey = `sem${semester}`;
    const formData = new FormData();

    formData.append("email", profiles.email); // Student email (unique ID)
    formData.append("semester", semester);
    formData.append("cgpa", cgpaData[semKey] || "");
    formData.append("gpa", gpaData[semKey] || "");

    // Attach file
    const file = uploadedFiles[`${semKey}_marksheet`]?.[0];
    if (file) formData.append("marksheet", file);

    try {
      const res = await fetch(`${BASE_URL}/student/marks`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: data.message,
          description: `Semester ${semester} data stored successfully.`,
        });
      } else {
        toast({
          title: data.message,
          description: data.error || "Could not save marks.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Network Error ⚠️",
        description: "Could not connect to backend.",
        variant: "destructive",
      });
    }
  };

  const handleUploadSubmit = async (type) => {
    try {
      const formData = new FormData();

      // Use the files stored by type
      const filesToUpload = uploadedFiles[type];
      if (!filesToUpload || filesToUpload.length === 0) {
        toast({
          title: "No files selected ❌",
          description: `Please choose at least one file for ${type}.`,
          variant: "destructive",
        });
        return;
      }

      filesToUpload.forEach((file) => formData.append("files", file));

      formData.append("email", profiles.email);
      formData.append("type", type);
      formData.append("details", uploadData.details || "");

      const response = await fetch(`${BASE_URL}/student/achievements`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("File upload failed");

      const data = await response.json();
      toast({
        title: "Upload Successful ✅",
        description: `${type} uploaded successfully.`,
      });

      // Clear only that type’s files
      setUploadedFiles((prev) => ({ ...prev, [type]: [] }));
    } catch (error) {
      console.error("Error uploading:", error);
      toast({
        title: "Upload Failed ❌",
        description: `Something went wrong while uploading ${type}.`,
        variant: "destructive",
      });
    }
  };


  const removeFile = (type, index) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev[type]];
      newFiles.splice(index, 1);
      return { ...prev, [type]: newFiles };
    });
  };



  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <TrendingUp className="text-blue-500 h-8 w-8" />
            <div>
              <p className="text-sm text-gray-500">Overall CGPA</p>
              <p className="text-2xl font-bold text-blue-600">{calculateOverall(cgpaData)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <Award className="text-yellow-500 h-8 w-8" />
            <div>
              <p className="text-sm text-gray-500">Achievements</p>
              <p className="text-2xl font-bold text-yellow-600">{uploadedFiles.achievements.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <FileText className="text-green-500 h-8 w-8" />
            <div>
              <p className="text-sm text-gray-500">Clear Semesters</p>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(arrearStatus).filter((s) => !s).length}/8
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="marks">Marks & CGPA</TabsTrigger>
          <TabsTrigger value="arrears">Arrear History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* === Profile Tab === */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Biodata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => handleProfileChange("dob", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Blood Group</Label>
                  <Select onValueChange={(val) => handleProfileChange("bloodGroup", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Community</Label>
                  <Select onValueChange={(val) => handleProfileChange("community", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OC">OC</SelectItem>
                      <SelectItem value="BC">BC</SelectItem>
                      <SelectItem value="MBC">MBC</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="ST">ST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Religion</Label>
                  <Input
                    value={profile.religion}
                    onChange={(e) => handleProfileChange("religion", e.target.value)}
                    placeholder="Enter religion"
                  />
                </div>

                <div>
                  <Label>Nationality</Label>
                  <Input
                    value={profile.nationality}
                    onChange={(e) => handleProfileChange("nationality", e.target.value)}
                    placeholder="Enter nationality"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Permanent Address</Label>
                  <Textarea
                    value={profile.permanentAddress}
                    onChange={(e) => handleProfileChange("permanentAddress", e.target.value)}
                    placeholder="Permanent address"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Temporary Address</Label>
                  <Textarea
                    value={profile.temporaryAddress}
                    onChange={(e) => handleProfileChange("temporaryAddress", e.target.value)}
                    placeholder="Temporary address"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    placeholder="Student phone number"
                  />
                </div>

                <div>
                  <Label>Aadhaar Number</Label>
                  <Input
                    value={profile.aadhaar}
                    onChange={(e) => handleProfileChange("aadhaar", e.target.value)}
                    placeholder="Aadhaar number"
                  />
                </div>

                <div>
                  <Label>PAN Card Number</Label>
                  <Input
                    value={profile.pan}
                    onChange={(e) => handleProfileChange("pan", e.target.value)}
                    placeholder="PAN number"
                  />
                </div>

                <div>
                  <Label>Aapar ID</Label>
                  <Input
                    value={profile.aapar}
                    onChange={(e) => handleProfileChange("aapar", e.target.value)}
                    placeholder="Aapar ID"
                  />
                </div>
              </div>

              {/* Parent Details (side-by-side) */}
              <div className="grid md:grid-cols-2 gap-8 mt-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Father’s Details</h3>
                  <div>
                    <Label>Father’s Name</Label>
                    <Input
                      value={profile.fatherName}
                      onChange={(e) => handleProfileChange("fatherName", e.target.value)}
                      placeholder="Father's name"
                    />
                  </div>
                  <div>
                    <Label>Occupation</Label>
                    <Input
                      value={profile.fatherOccupation}
                      onChange={(e) => handleProfileChange("fatherOccupation", e.target.value)}
                      placeholder="Father's occupation"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={profile.fatherPhone}
                      onChange={(e) => handleProfileChange("fatherPhone", e.target.value)}
                      placeholder="Father's phone number"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Mother’s Details</h3>
                  <div>
                    <Label>Mother’s Name</Label>
                    <Input
                      value={profile.motherName}
                      onChange={(e) => handleProfileChange("motherName", e.target.value)}
                      placeholder="Mother's name"
                    />
                  </div>
                  <div>
                    <Label>Occupation</Label>
                    <Input
                      value={profile.motherOccupation}
                      onChange={(e) => handleProfileChange("motherOccupation", e.target.value)}
                      placeholder="Mother's occupation"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={profile.motherPhone}
                      onChange={(e) => handleProfileChange("motherPhone", e.target.value)}
                      placeholder="Mother's phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Seat Type & Transport */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Seat Type</Label>
                  <Select onValueChange={(val) => handleProfileChange("seatType", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seat Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="counselling">Counselling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Transport</Label>
                  <Select onValueChange={(val) => handleProfileChange("busType", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Transport Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="college">College Bus</SelectItem>
                      <SelectItem value="outbus">Outbus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bus details / Aapar conditional */}
                {profile.busType === "college" && (
                  <>
                    <div>
                      <Label>Bus Number</Label>
                      <Input
                        value={profile.busNumber}
                        onChange={(e) => handleProfileChange("busNumber", e.target.value)}
                        placeholder="Bus number"
                      />
                    </div>
                    <div>
                      <Label>Bus Route</Label>
                      <Input
                        value={profile.busRoute}
                        onChange={(e) => handleProfileChange("busRoute", e.target.value)}
                        placeholder="Bus route"
                      />
                    </div>
                  </>
                )}

                {profile.busType === "outbus" && (
                  <div className="md:col-span-2">
                    <Label>Aapar ID (Outbus)</Label>
                    <Input
                      value={profile.aapar}
                      onChange={(e) => handleProfileChange("aapar", e.target.value)}
                      placeholder="AAPAR ID for outbus"
                    />
                  </div>
                )}
              </div>

              {/* Education (10th & 12th) */}
              <div className="space-y-4 mt-6">
                <h3 className="font-semibold text-lg">School Details</h3>

                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>10th School Studied</Label>
                    <Input
                      value={profile.tenthSchool}
                      onChange={(e) => handleProfileChange("tenthSchool", e.target.value)}
                      placeholder="School name"
                    />
                  </div>
                  <div>
                    <Label>Marks (out of 500)</Label>
                    <Input
                      type="number"
                      value={profile.tenthMarks}
                      onChange={(e) => handleProfileChange("tenthMarks", e.target.value)}
                      placeholder="e.g., 450"
                    />
                  </div>
                  <div>
                    <Label>Percentage</Label>
                    <Input value={profile.tenthPercentage} readOnly placeholder="Auto calculated" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>12th School Studied</Label>
                    <Input
                      value={profile.twelfthSchool}
                      onChange={(e) => handleProfileChange("twelfthSchool", e.target.value)}
                      placeholder="School name"
                    />
                  </div>
                  <div>
                    <Label>Marks (out of 600)</Label>
                    <Input
                      type="number"
                      value={profile.twelfthMarks}
                      onChange={(e) => handleProfileChange("twelfthMarks", e.target.value)}
                      placeholder="e.g., 520"
                    />
                  </div>
                  <div>
                    <Label>Percentage</Label>
                    <Input value={profile.twelfthPercentage} readOnly placeholder="Auto calculated" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveProfile}>Save Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Marks Tab === */}
        <TabsContent value="marks" className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const semKey = `sem${sem}`;

            return (
              <Card key={sem}>
                <CardHeader>
                  <CardTitle>Semester {sem} CGPA & GPA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">

                  {/* === CGPA === */}
                  <Label>CGPA</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpaData[semKey] || ""}
                    onChange={(e) => updateCGPA(semKey, e.target.value)}
                  />

                  {/* === GPA === */}
                  <Label>GPA</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={gpaData[semKey] || ""}
                    onChange={(e) => updateGPA(semKey, e.target.value)}
                  />

                  {/* === File Upload === */}
                  <Label>Upload Marksheet</Label>
                  <div className="relative flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(`${semKey}_marksheet`, e.target.files)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <button
                      type="button"
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Choose File
                    </button>
                  </div>

                  {/* === Show uploaded files === */}
                  {uploadedFiles[`${semKey}_marksheet`]?.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center border p-2 rounded mt-1">
                      <span className="text-sm">{file.name}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                          onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => removeFile(`${semKey}_marksheet`, idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* === Save Button === */}
                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => handleSaveMarks(sem)}
                    >
                      Save Semester {sem}
                    </button>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </TabsContent>


        {/* === Arrears Tab === */}
        <TabsContent value="arrears" className="space-y-4">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => {
            const semKey = `sem${sem}`; // ✅ Fixed template literal

            const hasArrear = arrearStatus[semKey];
            const details = arrearDetails[semKey] || [];

            return (
              <Card key={sem}>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Semester {sem} Arrears</CardTitle>

                  <Button
                    variant={hasArrear ? "destructive" : "secondary"}
                    onClick={() => toggleArrearStatus(semKey)}
                  >
                    {hasArrear ? "Mark as Cleared" : "Add Arrears"}
                  </Button>
                </CardHeader>

                <CardContent className="space-y-3">
                  {hasArrear && (
                    <>
                      {details.map((course, idx) => (
                        <div
                          key={idx}
                          className="flex gap-2 items-center border p-2 rounded-md"
                        >
                          <Input
                            placeholder="Course Name"
                            value={course.courseName}
                            onChange={(e) =>
                              updateArrearDetail(semKey, idx, "courseName", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Course Code"
                            value={course.courseCode}
                            onChange={(e) =>
                              updateArrearDetail(semKey, idx, "courseCode", e.target.value)
                            }
                          />
                          <Button
                            variant="ghost"
                            onClick={() => removeArrearCourse(semKey, idx)}
                            title="Remove course"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <Button onClick={() => addArrearCourse(semKey)} variant="outline">
                          + Add Course
                        </Button>
                        <Button onClick={() => saveArrearDetails(semKey)} variant="secondary">
                          Save
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* === Achievements Tab === */}
        <TabsContent value="achievements" className="space-y-4">
          <Card className="card-gradient shadow-academic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-academic-blue">
                <Award className="h-5 w-5" />
                Achievements & Certificates
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* === Achievements === */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="achievement-upload">Achievement Files</Label>
                  <Badge>{uploadedFiles.achievements.length} files</Badge>
                </div>
                <Input
                  id="achievement-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload("achievements", e.target.files)}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-gold file:text-white"
                />
                <div className="space-y-2 mt-2">
                  {uploadedFiles.achievements.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile("achievements", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* ✅ Save Button */}
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => handleUploadSubmit("achievements")}
                >
                  Save / Upload Files
                </Button>
              </div>

              {/* === Extra-Curricular === */}
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span>Extra-Curricular Activity Certificate</span>
                  <Badge>{uploadedFiles.extra?.length || 0} files</Badge>
                </div>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload("extra", e.target.files)}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-gold file:text-white"
                />
                <div className="space-y-2 mt-2">
                  {uploadedFiles.extra?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile("extra", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {/* ✅ Save Button */}
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => handleUploadSubmit("extra")}
                >
                  Save / Upload Files
                </Button>
              </div>

              {/* === Co-Curricular === */}
              <div className="space-y-4">
                {/* === Internship === */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Internship Certificate</span>
                    <Badge>{uploadedFiles.internship?.length || 0} files</Badge>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("internship", e.target.files)}
                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-gold file:text-white"
                  />
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.internship?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFile("internship", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* ✅ Save Button */}
                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={() => handleUploadSubmit("internship")}
                  >
                    Save / Upload Files
                  </Button>
                </div>

                {/* === Events === */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Events Participated Certificate</span>
                    <Badge>{uploadedFiles.events?.length || 0} files</Badge>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("events", e.target.files)}
                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-gold file:text-white"
                  />
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.events?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFile("events", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* ✅ Save Button */}
                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={() => handleUploadSubmit("events")}
                  >
                    Save / Upload Files
                  </Button>
                </div>

                {/* === Online Course === */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Online Course Certificate</span>
                    <Badge>{uploadedFiles.onlinecourse?.length || 0} files</Badge>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("onlinecourse", e.target.files)}
                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-gold file:text-white"
                  />
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.onlinecourse?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFile("onlinecourse", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* ✅ Save Button */}
                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={() => handleUploadSubmit("onlinecourse")}
                  >
                    Save / Upload Files
                  </Button>
                </div>

                {/* === NPTEL === */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>NPTEL Course Certificate</span>
                    <Badge>{uploadedFiles.nptel?.length || 0} files</Badge>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("nptel", e.target.files)}
                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-gold file:text-white"
                  />
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.nptel?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFile("nptel", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* ✅ Save Button */}
                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={() => handleUploadSubmit("nptel")}
                  >
                    Save / Upload Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Documents Tab === */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Additional Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span>Choose Documents</span>
                <span className="text-blue-600 font-semibold">{uploadedFiles.documents.length} files</span>
              </div>
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload("documents", e.target.files)}
                className="file:bg-yellow-500 file:text-white file:px-3 file:py-1 file:rounded file:border-0 file:cursor-pointer"
              />

              {uploadedFiles.documents.map((file, idx) => (
                <div key={idx} className="flex justify-between items-center border p-2 rounded mt-1">
                  <span>{file.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600"
                      onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFile("documents", idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleDocumentsUpload} className="mt-3">
                    Save / Upload Documents
                  </Button>

                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leave Application */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span>Select Leave Type</span>
                <span className="text-blue-600 font-semibold">{uploadedFiles.leaveLetters.length} files</span>
              </div>

              <Select onValueChange={(val) => setLeaveForm({ ...leaveForm, leaveType: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Leave Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="academic">Academic Leave</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid md:grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                />
                <Input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                />
              </div>

              <Textarea
                placeholder="Reason"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              />

              <Label>Upload Leave Letter</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, leaveLetter: e.target.files?.[0] || null })
                }
                className="file:bg-yellow-500 file:text-white file:px-3 file:py-1 file:rounded file:border-0 file:cursor-pointer"
              />

              <Label>Upload Medical Certificate (Optional)</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, medicalCertificate: e.target.files?.[0] || null })
                }
                className="file:bg-yellow-500 file:text-white file:px-3 file:py-1 file:rounded file:border-0 file:cursor-pointer"
              />

              <div className="flex justify-center mt-4">
                <Button onClick={handleLeaveSubmit}>Submit Leave</Button>
              </div>

              {uploadedFiles.leaveLetters.map((file, idx) => (
                <div key={idx} className="flex justify-between items-center border p-2 rounded mt-1">
                  <span>{file.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600"
                      onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFile("leaveLetters", idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* OD Application */}
          <Card>
            <CardHeader>
              <CardTitle>On-Duty (OD) Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span>Upload OD Letter</span>
                <span className="text-blue-600 font-semibold">{uploadedFiles.odLetters.length} files</span>
              </div>

              <Input
                placeholder="Event Name"
                value={odForm.eventName}
                onChange={(e) => setOdForm({ ...odForm, eventName: e.target.value })}
              />
              <Input
                placeholder="College Name"
                value={odForm.collegeName}
                onChange={(e) => setOdForm({ ...odForm, collegeName: e.target.value })}
              />
              <div className="grid md:grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={odForm.startDate}
                  onChange={(e) => setOdForm({ ...odForm, startDate: e.target.value })}
                />
                <Input
                  type="date"
                  value={odForm.endDate}
                  onChange={(e) => setOdForm({ ...odForm, endDate: e.target.value })}
                />
              </div>

              <Input
                type="file"
                onChange={(e) => setOdForm({ ...odForm, file: e.target.files?.[0] || null })}
                className="file:bg-yellow-500 file:text-white file:px-3 file:py-1 file:rounded file:border-0 file:cursor-pointer"
              />

              <div className="flex justify-center mt-4">
                <Button onClick={handleOdSubmit}>Submit OD</Button>
              </div>

              {uploadedFiles.odLetters.map((file, idx) => (
                <div key={idx} className="flex justify-between items-center border p-2 rounded mt-1">
                  <span>{file.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600"
                      onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFile("odLetters", idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Reports Tab === */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Report Overview</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handlePrint} variant="secondary">
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View and download consolidated academic, attendance, and achievements reports.
                These can be shared with your proctor or department for review.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;