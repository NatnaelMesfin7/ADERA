import Link from "next/link";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-sky-200/60 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-medium text-slate-800">ADERA Finance</p>
          <p className="mt-1 text-sm text-slate-500">(c) 2026 ADERA Finance</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a
            href="https://github.com/NatnaelMesfin7/ADERA/"
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 transition hover:text-slate-900"
          >
            GitHub
          </a>
          <Link
            href="/docs"
            className="text-slate-600 transition hover:text-slate-900"
          >
            Docs
          </Link>
          <Link
            href="/team"
            className="text-slate-600 transition hover:text-slate-900"
          >
            Team
          </Link>
          <a
            href="https://x.com/AwraLabs"
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 transition hover:text-slate-900"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
};
