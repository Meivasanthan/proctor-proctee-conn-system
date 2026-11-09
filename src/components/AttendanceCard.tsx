import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";

const AttendanceCard = () => {
    const openAttendance = () => {
        window.location.href = "http://localhost:3000";
    };

    return (
        <Card className="group transition-smooth cursor-pointer border-0 shadow-lg bg-green-100">
            <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <ClipboardCheck className="h-8 w-8 text-green-700" />
                </div>

                <CardTitle className="text-xl font-bold text-green-700">
                    Attendance Management
                </CardTitle>

                <CardDescription className="text-gray-700">
                    Manage student attendance, track records, and monitor classroom attendance.
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <Button
                    onClick={openAttendance}
                    variant="academic-outline"
                    className="w-full font-semibold hover:bg-green-600 hover:text-white"
                >
                    Open Attendance System
                </Button>
            </CardContent>
        </Card>
    );
};

export default AttendanceCard;