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
import { GameService } from "@/src/services/game";
import { KeycloakService } from "@/src/services/keycloack";

type MultiplierPanelProps = {
  multiplier: string;
  betValue: number | undefined;
  setBetValue: Dispatch<SetStateAction<number | undefined>>;
  bettingLocked?: boolean;
  roundId: string | null;
};

export function MultiplierPanel({
  multiplier,
  betValue,
  setBetValue,
  bettingLocked = false,
  roundId,
}: MultiplierPanelProps) {
  const maxBetValue = 1000;
  const minBetValue = 1;
  const [isBetting, setIsBetting] = useState(false);

  const handleBet = async () => {
    const gameService = new GameService(new KeycloakService());
    if (!betValue || !roundId) return;

    const amountInCents = Math.round(Number(betValue) * 100);

    setIsBetting(true);
    try {
      const response = await gameService.createBet({ amountInCents, roundId });
    } finally {
      setIsBetting(false);
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
              bettingLocked ||
              !roundId ||
              !betValue ||
              betValue < minBetValue
            }
            type="button"
            size="lg"
            aria-busy={isBetting}
            className="bg-linear-to-r min-w-38 cursor-pointer from-blue-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(59,130,246,0.45)] hover:brightness-110 disabled:cursor-not-allowed"
            onClick={handleBet}
          >
            {isBetting ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="size-4 shrink-0 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Apostando…
              </span>
            ) : (
              "Apostar"
            )}
          </Button>
          <Button
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
