import { type InputHTMLAttributes } from "react";

type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const NumberInput = ({ label, ...props }: NumberInputProps) => {
  return (
    <label className="grid gap-2 text-sm">
      <span className="subtle">{label}</span>
      <input
        type="number"
        step="any"
        className="h-11 rounded-xl border border-sky-200/70 bg-white/80 px-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/40"
        {...props}
      />
    </label>
  );
};
