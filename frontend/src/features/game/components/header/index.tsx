import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";

type GameHeaderProps = {
  balance: string;
  countdownSeconds?: number | null;
};

export function GameHeader({ balance, countdownSeconds }: GameHeaderProps) {
  const showCountdown = typeof countdownSeconds === "number";

  return (
    <Card className="border-white/10 bg-white/5 py-0 shadow-2xl backdrop-blur">
      <CardHeader className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardDescription className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
            Crash Game
          </CardDescription>
          <CardTitle className="mt-1 text-2xl text-white">
            Mesa Principal
          </CardTitle>
        </div>

        {showCountdown ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-cyan-400/35 bg-cyan-500/10 px-6 py-3 sm:min-w-36">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-cyan-200/90">
              Próxima rodada
            </p>
            <p
              className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              aria-live="polite"
              aria-atomic="true"
            >
              {countdownSeconds}
              <span className="ml-0.5 text-2xl font-semibold text-cyan-200/80">
                s
              </span>
            </p>
          </div>
        ) : null}

        <CardContent className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-right sm:shrink-0">
          <p className="text-xs uppercase tracking-widest text-emerald-300">
            Saldo
          </p>
          <p className="text-lg font-semibold text-emerald-200">{balance}</p>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
