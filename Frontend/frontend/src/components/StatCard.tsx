import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

const StatCard = ({ label, value, icon: Icon }: StatCardProps) => (
  <div className="bg-card rounded-2xl border border-primary/[0.15] p-5 relative">
    <Icon className="absolute top-4 right-4 h-5 w-5 text-primary/40" />
    <p className="text-3xl font-bold text-primary">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

export default StatCard;
