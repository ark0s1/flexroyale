interface StatsRowProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
  icon?: string;
}

export default function StatsRow({ label, value, subValue, color = 'text-white', icon }: StatsRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm flex items-center gap-2">
        {icon && <i className={`bi ${icon} w-4 text-center`} aria-hidden="true" />}
        {label}
      </span>
      <div className="text-right">
        <span className={`font-bold font-gaming tracking-wide ${color}`}>{value}</span>
        {subValue && <p className="text-gray-600 text-xs">{subValue}</p>}
      </div>
    </div>
  );
}
