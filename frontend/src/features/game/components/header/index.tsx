import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";

type GameHeaderProps = {
  balance: string;
};

export function GameHeader({ balance }: GameHeaderProps) {
  return (
    <Card className="border-white/10 bg-white/5 py-0 shadow-2xl backdrop-blur">
      
      <CardHeader className="flex flex-row items-center justify-between gap-4 p-5">
        <div>
          <CardDescription className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
            Crash Game
          </CardDescription>
          <CardTitle className="mt-1 text-2xl text-white">
            Mesa Principal
          </CardTitle>
        </div>

        <CardContent className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-widest text-emerald-300">
            Saldo
          </p>
          <p className="text-lg font-semibold text-emerald-200">{balance}</p>
        </CardContent>
        
      </CardHeader>
    </Card>
  );
}
