import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users } from "lucide-react";

interface RoleCardProps {
  role: 'student' | 'staff';
  title: string;
  description: string;
  icon: 'student' | 'staff';
  onSelect: () => void;
}

const RoleCard = ({ role, title, description, icon, onSelect }: RoleCardProps) => {
  const IconComponent = icon === 'student' ? GraduationCap : Users;

  // 🎨 Dynamic colors for card background, text & hover
  const cardBg = role === 'student' ? "bg-yellow-100" : "bg-blue-100";
  const iconBg = role === 'student' ? "bg-yellow-500/20" : "bg-blue-500/20";
  const textColor = role === 'student' ? "text-yellow-700" : "text-blue-700";
  const hoverBtn = role === 'student'
    ? "hover:bg-yellow-500 hover:text-white"
    : "hover:bg-blue-600 hover:text-white";

  return (
    <Card className={`group transition-smooth cursor-pointer border-0 shadow-lg ${cardBg}`}>
      <CardHeader className="text-center pb-4">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}>
          <IconComponent className={`h-8 w-8 ${textColor}`} />
        </div>
        <CardTitle className={`text-xl font-bold ${textColor}`}>{title}</CardTitle>
        <CardDescription className="text-gray-700">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={onSelect}
          variant="academic-outline"
          className={`w-full font-semibold ${hoverBtn}`}
        >
          Continue as {role === 'student' ? 'Proctee' : 'Proctor'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
