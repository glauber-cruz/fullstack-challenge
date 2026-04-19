"use client";

import { useEffect, useState } from "react";

import { socket } from "@/src/shared/lib/socket-io";

export type RoundsCountdownPayload = {
  seconds: number;
};

export function useRoundsCountdown() {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    const onCountdown = (data: RoundsCountdownPayload) => {
      setSeconds(data.seconds);
    };

    socket.on("rounds:countdown", onCountdown);
    return () => {
      socket.off("rounds:countdown", onCountdown);
    };
  }, []);

  return { seconds };
}
