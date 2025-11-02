import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileSectionProps {
  role: 'student' | 'staff';
  username?: string;
  registerNumber?: string;
  academicYear?: string;
  department?: string;
}

const ProfileSection = ({ role, username = "User", registerNumber, academicYear = "2024-2027", department }: ProfileSectionProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  const defaultAvatar = role === 'student' ? '🎓' : '🧑‍🏫';

  return (
    <Card className="w-full max-w-md card-gradient shadow-academic">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-academic-blue">
          {role === 'student' ? <GraduationCap className="h-5 w-5" /> : <Users className="h-5 w-5" />}
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-academic-blue/20">
              <AvatarImage src={profileImage || undefined} alt="Profile" />
              <AvatarFallback className="text-2xl bg-academic-blue/10">
                {profileImage ? <User className="h-8 w-8" /> : defaultAvatar}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="academic"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {isEditing && (
            <div className="space-y-2 w-full">
              <Label htmlFor="profile-upload">Upload Photo</Label>
              <Input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-academic-blue file:text-white"
              />
              {profileImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="w-full"
                >
                  Remove Photo
                </Button>
              )}
            </div>
          )}

          <div className="w-full space-y-3 text-center">
            <div>
              <Label className="text-sm text-muted-foreground">Username</Label>
              <p className="font-semibold text-academic-blue" onClick={() => navigate(`/students/${registerNumber}`)}>{username}</p>
            </div>

            {role === 'student' ? (
              <>
                <div>
                  <Label className="text-sm text-muted-foreground">Register Number</Label>
                  <p className="font-semibold">{registerNumber || "Not Set"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Academic Year</Label>
                  <p className="font-semibold">{academicYear}</p>
                </div>
              </>
            ) : (
              <div>
                <Label className="text-sm text-muted-foreground">Department</Label>
                <p className="font-semibold">{department || "Not Set"}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;