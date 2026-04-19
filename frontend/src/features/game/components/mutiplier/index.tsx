"use client";

import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { NumericFormat } from "react-number-format";

type MultiplierPanelProps = {
  multiplier: string;
  betValue: number | undefined;
  setBetValue: Dispatch<SetStateAction<number | undefined>>;
};

export function MultiplierPanel({
  multiplier,
  betValue,
  setBetValue,
}: MultiplierPanelProps) {
  const maxBetValue = 1000;
  const minBetValue = 1;

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
            aria-label="Valor da aposta"
            className="h-10 w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 text-sm text-slate-100 outline-none ring-cyan-300/50 placeholder:text-slate-400 focus:ring-2"
          />
          <Button
            disabled={!betValue || betValue < minBetValue}
            type="button"
            size="lg"
            className="bg-linear-to-r cursor-pointer from-blue-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(59,130,246,0.45)] hover:brightness-110"
          >
            Apostar
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
