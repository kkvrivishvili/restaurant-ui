"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useCountdown } from "@/hooks/useCountdown";

interface CountDownProps {
  targetDate: string | number | Date;
  className?: string;
}

const CountDown = ({ targetDate, className }: CountDownProps) => {
  const timeLeft = useCountdown(targetDate);

  if (timeLeft.total <= 0) {
    return null;
  }

  return (
    <div className={cn("grid grid-cols-4 gap-4", className)}>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold text-primary">{formatNumber(timeLeft.days)}</span>
        <span className="text-xs text-muted-foreground">Días</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold text-primary">{formatNumber(timeLeft.hours)}</span>
        <span className="text-xs text-muted-foreground">Horas</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold text-primary">{formatNumber(timeLeft.minutes)}</span>
        <span className="text-xs text-muted-foreground">Minutos</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold text-primary">{formatNumber(timeLeft.seconds)}</span>
        <span className="text-xs text-muted-foreground">Segundos</span>
      </div>
    </div>
  );
};

export default CountDown;