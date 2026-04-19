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
              className="rounded-md border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-sm font-semibold text-indigo-200"
            >
              {multiplier}
            </span>
          ))}
        </div>
      </CardContent>

    </Card>
  );
}
