import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function ReportCard({ title, description, icon: Icon, onClick }: ReportCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-slate-50 border-slate-200"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          <Icon size={24} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
