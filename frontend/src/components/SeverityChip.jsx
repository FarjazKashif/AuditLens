const toneMap = {
  critical: "border-danger/50 bg-danger/10 text-danger",
  high: "border-amber/50 bg-amber/10 text-amber",
  medium: "border-cyan/50 bg-cyan/10 text-cyanSoft",
  low: "border-blue/50 bg-blue/10 text-blue"
};

export function SeverityChip({ severity }) {
  return (
    <span className={`rounded border px-2 py-1 font-mono text-[10px] uppercase ${toneMap[severity] || toneMap.low}`}>
      {severity}
    </span>
  );
}
