import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";

type HistoryPanelProps = {
  history: string[];
};

export function HistoryPanel({ history }: HistoryPanelProps) {
  const getHistoryStyle = (multiplier: string) => {
    
    const numericMultiplier = Number.parseFloat(multiplier.replace("x", ""));
    if (Number.isNaN(numericMultiplier)) {
      return "border-slate-400/30 bg-slate-500/10 text-slate-200";
    }

    return numericMultiplier >= 2
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      : "border-rose-400/30 bg-rose-500/10 text-rose-200";
  };

  return (
    <Card className="border-white/10 bg-white/5 py-0 shadow-2xl backdrop-blur">
      
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-white">Historico</CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        <div className="flex flex-wrap gap-2">
          {history.map((multiplier) => (
            <span
              key={multiplier}
              className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${getHistoryStyle(multiplier)}`}
            >
              {multiplier}
            </span>
          ))}
        </div>
      </CardContent>

    </Card>
  );
}
