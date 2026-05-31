import { cn } from "@/lib/utils";
import { GuessDistributionRow } from "@/types/game-types";

type GuessDistributionChartProps = {
  rows: GuessDistributionRow[];
};

const GuessDistributionChart = ({ rows }: GuessDistributionChartProps) => (
  <div className="flex flex-col gap-2">
    <p className="text-[0.625rem] uppercase tracking-wide text-muted-foreground">
      Guess distribution
    </p>
    <div className="flex flex-col gap-1.5">
      {rows.map(({ key, label, count, barWidth, isLoss }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-4 shrink-0 text-right font-pixel text-xs">
            {label}
          </span>
          <div
            className={cn(
              "omori-border h-5 min-w-0 flex-1 bg-[var(--omori-empty)] p-px",
            )}
          >
            {count > 0 ? (
              <div
                className={cn(
                  "h-full transition-[width] duration-300",
                  isLoss
                    ? "bg-[var(--omori-absent)]"
                    : "bg-[var(--omori-correct)]",
                )}
                style={{ width: barWidth }}
              />
            ) : null}
          </div>
          <span className="w-5 shrink-0 text-right font-pixel text-xs tabular-nums">
            {count}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default GuessDistributionChart;
