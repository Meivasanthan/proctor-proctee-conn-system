import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Video, AlertCircle, Play, Square, Activity } from "lucide-react";
import { axiosBase } from "@/api.js";
import { useToast } from "@/hooks/use-toast";

interface Alert {
    student_id: number;
    type: string;
    confidence: number;
    suspicion_level: number;
}

interface CameraMonitoringProps {
    staffId?: string;
}

const CameraMonitoring = ({ staffId }: CameraMonitoringProps) => {
    const { toast } = useToast();
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [frame, setFrame] = useState<string | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [studentCount, setStudentCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);

    // Check camera service availability
    useEffect(() => {
        checkCameraHealth();
    }, []);

    const checkCameraHealth = async () => {
        try {
            await axiosBase.get(`/camera/health`, { timeout: 5000 });
            setCameraAvailable(true);
        } catch (error) {
            console.warn("Camera service not available:", error);
            setCameraAvailable(false);
        }
    };

    // Start monitoring
    const handleStartMonitoring = async () => {
        if (!cameraAvailable) {
            toast({
                title: "Error",
                description: "Camera service is not available. Please ensure Python camera service is running.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);
            await axiosBase.post(`/camera/start`);
            setIsMonitoring(true);
            toast({ title: "Success", description: "Camera monitoring started" });
            startFrameFetch();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to start camera monitoring", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    // Stop monitoring
    const handleStopMonitoring = async () => {
        try {
            setIsLoading(true);
            await axiosBase.post(`/camera/stop`);
            setIsMonitoring(false);
            setFrame(null);
            setAlerts([]);
            setStudentCount(0);
            toast({ title: "Success", description: "Camera monitoring stopped" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to stop camera monitoring", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch frames and alerts
    const startFrameFetch = () => {
        const interval = setInterval(async () => {
            try {
                const frameResponse = await axiosBase.get(`/camera/frame`);
                const { frame: frameData, alerts: alertsData, student_count } = frameResponse.data;

                setFrame(frameData);
                setAlerts(alertsData || []);
                setStudentCount(student_count || 0);
                setLastUpdate(Date.now());
            } catch (error) {
                console.error("Failed to fetch frame:", error);
                if (error.response?.status === 404) {
                    // Frame not available yet
                } else {
                    clearInterval(interval);
                }
            }
        }, 500); // Fetch every 500ms

        return () => clearInterval(interval);
    };

    // Auto-start fetching when monitoring is active
    useEffect(() => {
        if (isMonitoring) {
            return startFrameFetch();
        }
    }, [isMonitoring]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Video className="h-5 w-5" />
                            <CardTitle>Camera Monitoring</CardTitle>
                            <Badge variant={cameraAvailable ? "default" : "destructive"}>
                                {cameraAvailable ? "Ready" : "Offline"}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleStartMonitoring}
                                disabled={isMonitoring || isLoading || !cameraAvailable}
                                className="gap-2"
                            >
                                <Play className="h-4 w-4" />
                                Start
                            </Button>
                            <Button
                                onClick={handleStopMonitoring}
                                disabled={!isMonitoring || isLoading}
                                variant="destructive"
                                className="gap-2"
                            >
                                <Square className="h-4 w-4" />
                                Stop
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Camera Feed */}
                    <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                        {frame ? (
                            <img src={`data:image/jpeg;base64,${frame}`} alt="Camera feed" className="w-full h-full object-cover" />
                        ) : isMonitoring ? (
                            <div className="text-white flex flex-col items-center gap-2">
                                <Activity className="h-8 w-8 animate-spin" />
                                <p>Loading camera feed...</p>
                            </div>
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center gap-2">
                                <Video className="h-8 w-8" />
                                <p>Click "Start" to begin monitoring</p>
                            </div>
                        )}
                    </div>

                    {/* Status Info */}
                    {isMonitoring && (
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-blue-50">
                                <CardContent className="pt-4">
                                    <p className="text-sm text-gray-600">Students Detected</p>
                                    <p className="text-2xl font-bold text-blue-600">{studentCount}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-yellow-50">
                                <CardContent className="pt-4">
                                    <p className="text-sm text-gray-600">Alerts</p>
                                    <p className="text-2xl font-bold text-yellow-600">{alerts.length}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-green-50">
                                <CardContent className="pt-4">
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className="text-sm font-bold text-green-600">Active</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Alerts Section */}
                    {alerts.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Active Alerts</h3>
                            {alerts.map((alert, idx) => (
                                <Alert key={idx} className="border-yellow-500 bg-yellow-50">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800">
                                        <strong>Student {alert.student_id}</strong>: Suspicious behavior detected (Confidence:{" "}
                                        {(alert.confidence * 100).toFixed(1)}%) - Suspicion Level: {alert.suspicion_level}
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    )}

                    {/* No Camera Service Message */}
                    {!cameraAvailable && (
                        <Alert className="border-red-500 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                <strong>Camera Service Not Available</strong>
                                <p className="mt-2 text-sm">
                                    The Python camera monitoring service is not running. Please start it with:
                                </p>
                                <code className="block bg-red-100 p-2 rounded mt-2 text-xs">python camera_service.py</code>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CameraMonitoring;
