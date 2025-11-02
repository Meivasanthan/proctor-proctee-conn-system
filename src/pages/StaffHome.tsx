// @ts-nocheck
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";
import AcademicCarousel from "@/components/AcademicCarousel";
import ProfileSection from "@/components/ProfileSection";
import StaffDashboard from "@/components/StaffDashboard";

const StaffHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  console.log("Location State:", state);
  const { userData, role } = state;

  // ✅ Ensure valid data
  // useEffect(() => {
  //   if (!userData || role !== "staff") {
  //     navigate("/", { replace: true }); // redirect if invalid
  //   }
  // }, [navigate, userData, role]);

  // if (!userData) return null; // Render nothing until userData exists

  const username = userData?.name || " "; // Use backend name
  const email = userData?.email || " ";
  const department = userData?.department || " ";
  const stffId = userData?.staffId || " ";

  return (
    <div className="min-h-screen academic-pattern">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-academic-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <h1 className="text-xl font-bold text-academic-blue">Proctor-Proctee System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-academic-blue mb-2">Welcome, {username || ''} 🧑‍🏫</h2>
          <p className="text-muted-foreground">Department: {department || ''}</p>
        </div>

        <div className="mb-8"><AcademicCarousel /></div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <ProfileSection role="staff" username={username || ''} email={email || ''} department={department || ''} />
          </div>
          <div className="lg:col-span-3"><StaffDashboard staffId={stffId} /></div>
        </div>
      </main>
    </div>
  );
};

export default StaffHome;
