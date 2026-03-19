import Image from "next/image";
import Link from "next/link";
import { WalletConnectButton } from "app/components/wallet/WalletConnectButton";

export const AppHeader = () => {
  return (
    <header className="card-flat px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-rose-200/30 bg-black/65 shadow-[0_0_0_1px_rgba(255,58,70,0.24),0_0_26px_rgba(255,58,70,0.28)]">
            <Image
              src="/logo.jpg"
              alt="ADERA Finance logo"
              fill
              sizes="56px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <p className="kicker">ADERA Finance</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
              Moonbase Alpha's Credit-Aware Lending Protocol
            </h1>
          </div>
        </Link>
        <div className="grid justify-items-end gap-2">
          <WalletConnectButton />
          <Link
            href="https://moonbase-minterc20.netlify.app/"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-black/20 bg-white/5 px-3 text-sm font-medium text-black transition duration-200 hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/75 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Token Mint
          </Link>
        </div>
      </div>
      <p className="subtle mt-4 max-w-3xl text-sm leading-relaxed">
        Adera Finance is a credit-aware decentralized lending protocol built on
        Polkadot Moonbeam.
      </p>
    </header>
  );
};
