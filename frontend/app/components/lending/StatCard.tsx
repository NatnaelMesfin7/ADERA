import { Card } from "app/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export const StatCard = ({ label, value, hint }: StatCardProps) => {
  return (
    <Card className="relative overflow-hidden p-0">
      <div className="h-1 w-full bg-[linear-gradient(90deg,#5ab1ff_0%,#3b82f6_100%)]" />
      <div className="px-5 py-4">
        <p className="subtle text-xs uppercase tracking-[0.16em]">{label}</p>
        <p className="balance-text mt-3 text-3xl font-semibold text-slate-900">
          {value}
        </p>
        {hint ? <p className="subtle mt-2 text-xs">{hint}</p> : null}
      </div>
    </Card>
  );
};
