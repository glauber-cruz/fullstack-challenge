"use client";

import { useEffect, useState } from "react";

import { socket } from "@/src/shared/lib/socket-io";

export type countdownPayload = {
  roundId: string;
  seconds: number;
};

export type runningPayload = {
  multiplier: number;
};

export type betsCreatedPayload = {
  id: string;
  userId: string;
  roundId: string;
  amount: string;
  status: string;
  username: string;
};

export function useGameEvents() {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(1.0);
  const [roundId, setRoundId] = useState<string | null>(null);
  const [createdBet, setCreatedBet] = useState<betsCreatedPayload | null>(null);

  useEffect(() => {
    const onBetsCreated = (data: betsCreatedPayload) => {
      setCreatedBet(data);
    };

    const onCountdown = (data: countdownPayload) => {
      setSeconds(data.seconds);
      setRoundId(data.roundId);
    };

    const onRunning = (data: runningPayload) => {
      setMultiplier(Number(data.multiplier.toFixed(2)));
    };

    socket.on("rounds:countdown", onCountdown);
    socket.on("rounds:running", onRunning);
    socket.on("bets:created", onBetsCreated);

    return () => {
      socket.off("rounds:countdown", onCountdown);
      socket.off("rounds:running", onRunning);
      socket.off("bets:created", onBetsCreated);
      socket.disconnect();
    };
  }, []);

  return { seconds, multiplier, roundId, createdBet };
}
