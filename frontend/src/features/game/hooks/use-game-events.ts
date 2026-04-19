"use client";

import { useEffect, useState } from "react";

import { socket } from "@/src/shared/lib/socket-io";

export type countdownPayload = {
  seconds: number;
};

export type runningPayload = {
  roundId: string;
  multiplier: number;
};

export type betsCreatedPayload = {
  id: string;
  userId: string;
  roundId: string;
  amount: string;
};

export function useGameEvents() {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(1.0);

  useEffect(() => {
    const onBetsCreated = (data: betsCreatedPayload) => {
      console.log("bets:created", data);
    };

    const onCountdown = (data: countdownPayload) => {
      setSeconds(data.seconds);
    };

    const onRunning = (data: runningPayload) => {
      setMultiplier(Number(data.multiplier.toFixed(2)));
    };

    socket.on("rounds:countdown", onCountdown);
    socket.on("rounds:running", onRunning);
    socket.on("bets:created", onBetsCreated);

    return () => {
      socket.off("rounds:countdown", onCountdown);
    };
  }, []);

  return { seconds, multiplier };
}
