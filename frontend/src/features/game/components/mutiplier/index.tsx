"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { NumericFormat } from "react-number-format";
import { Loader2 } from "lucide-react";
import { GameService } from "@/src/services/game";
import { KeycloakService } from "@/src/services/keycloack";
import { toast } from "sonner";

type MultiplierPanelProps = {
  multiplier: string;
  betValue: number | undefined;
  setBetValue: Dispatch<SetStateAction<number | undefined>>;
  bettingLocked?: boolean;
  roundId: string | null;
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
  currentMultiplier: number | null;
};

export function MultiplierPanel({
  multiplier,
  betValue,
  setBetValue,
  bettingLocked = false,
  roundId,
  balance,
  setBalance,
  currentMultiplier,
}: MultiplierPanelProps) {
  const maxBetValue = 1000;
  const minBetValue = 1;

  const [isBetting, setIsBetting] = useState(false);
  const [isCashout, setIsCashout] = useState(false);

  const [currentBet, setCurrentBet] = useState<{
    id: string;
    roundId: string;
  } | null>(null);
  const hasBetInCurrentRound = Boolean(
    currentBet && roundId && currentBet.roundId === roundId,
  );

  function calculateGain(betValue: number) {
    if (!currentMultiplier) return 0;
    return betValue * currentMultiplier;
  }

  const handleBet = async () => {
    const gameService = new GameService(new KeycloakService());
    if (!betValue || !roundId || hasBetInCurrentRound || betValue > balance)
      return;

    const amountInCents = Math.round(Number(betValue) * 100);
    setIsBetting(true);

    try {
      const response = await gameService.createBet({ amountInCents, roundId });
      setCurrentBet({ id: response.id, roundId });
      toast.success("Aposta realizada com sucesso!");
    } catch {
      toast.error("Erro ao realizar aposta!");
    } finally {
      setIsBetting(false);
    }
  };

  const handleCashout = async () => {
    const gameService = new GameService(new KeycloakService());
    if (!betValue || !roundId) return;

    setIsCashout(true);
    try {
      if (!currentBet || currentBet.roundId !== roundId) return;
      await gameService.cashoutBet({ betId: currentBet.id });
      const gain = calculateGain(betValue);
      setBalance((previousBalance) => previousBalance + gain);
      setCurrentBet(null);
      toast.success("Cashout realizado com sucesso!");
    } catch {
      toast.error(
        "Erro ao realizar cashout! não se preocupe, essa aposta não foi contabilizada",
      );
    } finally {
      setIsCashout(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 py-0 shadow-2xl backdrop-blur">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-white">Multiplicador Atual</CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-cyan-300/20 bg-slate-900/70">
          <p className="text-7xl font-extrabold tracking-tight text-cyan-300 drop-shadow-[0_0_24px_rgba(34,211,238,0.9)] md:text-8xl">
            {multiplier}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <NumericFormat
            value={betValue}
            onValueChange={({ floatValue }) => {
              if (bettingLocked || isBetting) return;
              if (floatValue === undefined || Number.isNaN(floatValue)) {
                setBetValue(undefined);
                return;
              }
              setBetValue(Math.min(maxBetValue, floatValue));
            }}
            isAllowed={(values) => {
              const { floatValue } = values;
              if (floatValue === undefined) return true;
              return floatValue <= maxBetValue;
            }}
            placeholder="Digite o valor da aposta"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            disabled={bettingLocked || isBetting}
            aria-label="Valor da aposta"
            className="h-10 w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 text-sm text-slate-100 outline-none ring-cyan-300/50 placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            disabled={
              isBetting ||
              hasBetInCurrentRound ||
              bettingLocked ||
              !roundId ||
              !betValue ||
              betValue < minBetValue ||
              betValue > balance
            }
            type="button"
            size="lg"
            aria-busy={isBetting}
            className="bg-linear-to-r min-w-38 cursor-pointer from-blue-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(59,130,246,0.45)] hover:brightness-110 disabled:cursor-not-allowed"
            onClick={handleBet}
          >
            {isBetting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                Apostando…
              </span>
            ) : hasBetInCurrentRound ? (
              "Apostado"
            ) : (
              "Apostar"
            )}
          </Button>
          <Button
            onClick={handleCashout}
            disabled={isCashout || !bettingLocked || !hasBetInCurrentRound}
            type="button"
            size="lg"
            variant="secondary"
            className="bg-emerald-500 cursor-pointer text-emerald-950 shadow-[0_0_16px_rgba(34,197,94,0.45)] hover:bg-emerald-400"
          >
            Cash Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
