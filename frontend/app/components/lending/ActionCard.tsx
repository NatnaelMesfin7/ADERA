"use client";

import { useMemo, useState } from "react";
import { Button } from "app/components/ui/Button";
import { Card } from "app/components/ui/Card";
import { NumberInput } from "app/components/ui/NumberInput";
import { TokenSelect } from "app/components/ui/TokenSelect";
import type { LendingAction, LendingToken } from "@/types/lending";

type ActionCardProps = {
  action: LendingAction;
  title: string;
  description: string;
  buttonLabel: string;
  tokens: LendingToken[];
  onSubmit: (token: LendingToken, amount: string) => Promise<void>;
  busy: boolean;
};

const actionTheme: Record<LendingAction, { chip: string; glow: string }> = {
  deposit: {
    chip: "border-sky-300/60 bg-sky-200/60 text-slate-800",
    glow: "#5ab1ff",
  },
  borrow: {
    chip: "border-blue-300/60 bg-blue-200/60 text-slate-800",
    glow: "#3b82f6",
  },
  repay: {
    chip: "border-amber-300/60 bg-amber-200/60 text-amber-900",
    glow: "#f59e0b",
  },
  withdraw: {
    chip: "border-slate-300/60 bg-white/80 text-slate-700",
    glow: "#cbd5f5",
  },
};

export const ActionCard = ({
  action,
  title,
  description,
  buttonLabel,
  tokens,
  onSubmit,
  busy,
}: ActionCardProps) => {
  const [amount, setAmount] = useState("");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>(
    tokens[0]?.address ?? "",
  );
  const theme = useMemo(() => actionTheme[action], [action]);

  const selectedToken = useMemo(
    () =>
      tokens.find((token) => token.address === selectedTokenAddress) ??
      tokens[0] ??
      null,
    [tokens, selectedTokenAddress],
  );

  const tokenOptions = useMemo(
    () =>
      tokens.map((token) => ({
        value: token.address,
        label: token.symbol,
        hint: token.name,
      })),
    [tokens],
  );

  return (
    <Card className="relative grid gap-4 overflow-hidden">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-30 blur-2xl"
        style={{ backgroundColor: theme.glow }}
      />

      <div>
        <span
          className={`inline-flex rounded-full border px-2 py-1 text-[0.7rem] uppercase tracking-[0.16em] ${theme.chip}`}
        >
          {action}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="subtle mt-1 text-sm leading-relaxed">{description}</p>
      </div>

      <TokenSelect
        label="Asset"
        value={selectedToken?.address ?? ""}
        options={tokenOptions}
        disabled={busy || tokens.length === 0}
        onChange={setSelectedTokenAddress}
      />

      <NumberInput
        label={`Amount${selectedToken ? ` (${selectedToken.symbol})` : ""}`}
        placeholder="0.00"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <Button
        disabled={busy || !amount || !selectedToken}
        onClick={async () => {
          if (!selectedToken) return;
          await onSubmit(selectedToken, amount);
          setAmount("");
        }}
      >
        {busy ? "Processing..." : buttonLabel}
      </Button>
    </Card>
  );
};
