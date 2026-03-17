type TokenOption = {
  value: string;
  label: string;
  hint?: string;
};

type TokenSelectProps = {
  label: string;
  value: string;
  options: TokenOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

export const TokenSelect = ({
  label,
  value,
  options,
  disabled,
  onChange,
}: TokenSelectProps) => {
  return (
    <label className="grid gap-2 text-sm">
      <span className="subtle">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-sky-200/70 bg-white/80 px-3 text-slate-800 outline-none transition focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/40 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {options.length === 0 ? (
          <option value="">No tokens configured</option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-white text-slate-900">
            {option.hint ? `${option.label} - ${option.hint}` : option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
