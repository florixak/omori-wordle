type StatCellProps = {
  value: string | number;
  label: string;
  sublabel?: string;
};

const StatCell = ({ value, label, sublabel }: StatCellProps) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <span className="font-pixel text-xl tabular-nums sm:text-2xl">{value}</span>
    <span className="text-[0.625rem] uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
    {sublabel ? (
      <span className="text-[0.625rem] text-muted-foreground">{sublabel}</span>
    ) : null}
  </div>
);

export default StatCell;
