"use client";

import { BetsTable } from "@/src/features/game/components/round-bets";
import { GameHeader } from "@/src/features/game/components/header";

import { HistoryPanel } from "@/src/features/game/components/history";
import { MultiplierPanel } from "@/src/features/game/components/mutiplier";

import { mockBets, mockHistory } from "@/src/features/game/mocks/game-data";
import { useGameEvents } from "@/src/features/game/hooks/use-game-events";
import { useAuthGuard } from "@/src/shared/hooks/use-auth-guard";

import { useState } from "react";

export default function Game() {
  const { loading } = useAuthGuard();
  const [betValue, setBetValue] = useState<number>();
  const { seconds: countdownSeconds, multiplier: currentMultiplier } =
    useGameEvents();

  if (loading) return <div>Loading...</div>;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-8">
      <div className="absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
        <GameHeader balance="R$ 2.450,00" countdownSeconds={countdownSeconds} />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <MultiplierPanel
            multiplier={`${currentMultiplier?.toString()}x`}
            betValue={betValue}
            setBetValue={setBetValue}
            bettingLocked={countdownSeconds === 0}
          />
          <HistoryPanel history={mockHistory} />
        </div>

        <BetsTable bets={mockBets} />
      </div>
    </main>
  );
}
