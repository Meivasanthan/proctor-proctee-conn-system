import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StudentViews = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/students/${id}`);
                setStudent(res.data.data);
            } catch (error) {
                console.error("Error fetching student:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                <Loader2 className="animate-spin mr-2" /> Loading student details...
            </div>
        );

    if (!student) return <p className="text-center mt-10 text-red-500">Student not found</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-blue-700 text-xl">Student Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Register No:</strong> {student.studentId}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Department:</strong> {student.department}</p>
                    <p><strong>Year:</strong> {student.year}</p>
                    <p><strong>Section:</strong> {student.section}</p>
                </CardContent>
            </Card>

            {/* Basic Details */}
            {student.basic && (
                <Card>
                    <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                        {Object.entries(student.basic).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {String(value || "—")}</p>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Parents */}
            <Card>
                <CardHeader><CardTitle>Parents</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-blue-600">Father</h4>
                        <p><strong>Name:</strong> {student.father?.name}</p>
                        <p><strong>Occupation:</strong> {student.father?.occupation}</p>
                        <p><strong>Phone:</strong> {student.father?.phone}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-600">Mother</h4>
                        <p><strong>Name:</strong> {student.mother?.name}</p>
                        <p><strong>Occupation:</strong> {student.mother?.occupation}</p>
                        <p><strong>Phone:</strong> {student.mother?.phone}</p>
                    </div>
                </CardContent>
            </Card>

            {/* School Info */}
            <Card>
                <CardHeader><CardTitle>School Information</CardTitle></CardHeader>
                <CardContent>
                    <p><strong>10th School:</strong> {student.school?.tenth?.name}</p>
                    <p><strong>10th %:</strong> {student.school?.tenth?.percentage}</p>
                    <Separator className="my-2" />
                    <p><strong>12th School:</strong> {student.school?.twelfth?.name}</p>
                    <p><strong>12th %:</strong> {student.school?.twelfth?.percentage}</p>
                </CardContent>
            </Card>

            {/* Marks */}
            <Card>
                <CardHeader><CardTitle>Academic Performance</CardTitle></CardHeader>
                <CardContent>
                    {student.marks?.length ? (
                        student.marks.map((m, i) => (
                            <div key={i} className="border p-2 rounded mb-2">
                                <p><strong>Semester:</strong> {m.semester}</p>
                                <p><strong>GPA:</strong> {m.gpa}</p>
                                <p><strong>CGPA:</strong> {m.cgpa}</p>
                                {m.marksheetUrl && (
                                    <a
                                        href={`${BASE_URL}${m.marksheetUrl}`}
                                        target="_blank"
                                        className="text-blue-600 underline"
                                    >
                                        View Marksheet
                                    </a>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No marks available</p>
                    )}
                </CardContent>
            </Card>

            {/* Arrears */}
            <Card>
                <CardHeader><CardTitle>Arrears</CardTitle></CardHeader>
                <CardContent>
                    {student.arrears?.length ? (
                        student.arrears.map((a, i) => (
                            <div key={i} className="border p-2 rounded mb-2">
                                <p><strong>Semester:</strong> {a.semester}</p>
                                {a.courses.map((c, j) => (
                                    <p key={j}>📘 {c.courseCode} - {c.courseName}</p>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No arrears found</p>
                    )}
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
                <CardContent>
                    {student.achievements?.length ? (
                        student.achievements.map((a, i) => (
                            <div key={i} className="border p-2 rounded mb-2">
                                <Badge>{a.type}</Badge>
                                <p><strong>Details:</strong> {a.details}</p>
                                {a.fileUrl && (
                                    <a href={`${BASE_URL}${a.fileUrl}`} target="_blank" className="text-blue-600 underline">
                                        View File
                                    </a>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No achievements yet</p>
                    )}
                </CardContent>
            </Card>

            {/* Leave Records */}
            <Card>
                <CardHeader><CardTitle>Leaves</CardTitle></CardHeader>
                <CardContent>
                    {student.leaves?.length ? (
                        student.leaves.map((l, i) => (
                            <div key={i} className="border p-2 rounded mb-2">
                                <p><strong>Type:</strong> {l.type}</p>
                                <p><strong>From:</strong> {new Date(l.from).toLocaleDateString()}</p>
                                <p><strong>To:</strong> {new Date(l.to).toLocaleDateString()}</p>
                                <p><strong>Reason:</strong> {l.reason}</p>
                                {l.letterUrl && <a href={`${BASE_URL}${l.letterUrl}`} target="_blank" className="text-blue-600 underline">Letter</a>}
                            </div>
                        ))
                    ) : (
                        <p>No leave records</p>
                    )}
                </CardContent>
            </Card>

            {/* On Duty */}
            <Card>
                <CardHeader><CardTitle>On Duty (OD)</CardTitle></CardHeader>
                <CardContent>
                    {student.onDuties?.length ? (
                        student.onDuties.map((od, i) => (
                            <div key={i} className="border p-2 rounded mb-2">
                                <p><strong>Event:</strong> {od.eventName}</p>
                                <p><strong>College:</strong> {od.collegeName}</p>
                                <p><strong>From:</strong> {new Date(od.from).toLocaleDateString()}</p>
                                <p><strong>To:</strong> {new Date(od.to).toLocaleDateString()}</p>
                                {od.odLetterUrl && (
                                    <a href={`${BASE_URL}${od.odLetterUrl}`} target="_blank" className="text-blue-600 underline">
                                        View OD Letter
                                    </a>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No on-duty records</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentViews;
