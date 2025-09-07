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

  return (
    <Card className="group hover:shadow-elevated transition-smooth cursor-pointer card-gradient border-0 shadow-academic">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-academic-blue/10">
          <IconComponent className="h-8 w-8 text-academic-blue" />
        </div>
        <CardTitle className="text-xl font-bold text-academic-blue">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={onSelect}
          variant="academic-outline" 
          className="w-full group-hover:bg-academic-blue group-hover:text-white"
        >
          Continue as {role === 'student' ? 'Proctee' : 'Proctor'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleCard;