"use client";

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
  defaultBetValue: number;
};

export function MultiplierPanel({
  multiplier,
  defaultBetValue,
}: MultiplierPanelProps) {
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
            defaultValue={defaultBetValue}
            decimalScale={2}
            fixedDecimalScale
            decimalSeparator=","
            thousandSeparator="."
            prefix="R$ "
            allowNegative={false}
            isAllowed={({ floatValue }) =>
              floatValue === undefined ||
              (floatValue >= 1 && floatValue <= 1000)
            }
            aria-label="Valor da aposta"
            className="h-10 rounded-lg border border-white/15 bg-slate-900/70 px-3 text-sm text-slate-100 outline-none ring-cyan-300/50 placeholder:text-slate-400 focus:ring-2"
          />
          <Button
            type="button"
            size="lg"
            className="bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(59,130,246,0.45)] hover:brightness-110"
          >
            Apostar
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="bg-emerald-500 text-emerald-950 shadow-[0_0_16px_rgba(34,197,94,0.45)] hover:bg-emerald-400"
          >
            Cash Out
          </Button>
        </div>
        
      </CardContent>
    </Card>
  );
}
