import Link from "next/link";
import Image from "next/image";

type SiteHeaderProps = {
  showSectionLinks?: boolean;
};

const sectionLinks = [
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
];

export const SiteHeader = ({ showSectionLinks = true }: SiteHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-sky-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-sky-200/70 bg-white/80 shadow-[0_0_0_1px_rgba(56,189,248,0.24),0_0_26px_rgba(59,130,246,0.22)]">
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
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
              ADERA
            </p>
            <p className="text-sm font-medium text-slate-700">Finance</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {showSectionLinks
            ? sectionLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-sky-100/70 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))
            : null}
          <Link
            href="/team"
            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-sky-100/70 hover:text-slate-900"
          >
            Team
          </Link>
          <Link
            href="/docs"
            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-sky-100/70 hover:text-slate-900"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/docs"
            className="hidden rounded-xl border border-sky-200/70 bg-white/70 px-4 py-2 text-sm text-slate-700 transition hover:border-sky-300/70 hover:bg-sky-100/70 sm:inline-flex"
          >
            Read Docs
          </Link>
          <Link
            href="/lending-page"
            className="inline-flex rounded-xl border border-sky-300/60 bg-sky-400/20 px-4 py-2 text-sm font-medium text-sky-900 transition hover:border-sky-300/80 hover:bg-sky-400/30"
          >
            Launch App
          </Link>
        </div>
      </div>

      {showSectionLinks ? (
        <nav className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-4 pb-3 text-sm md:hidden sm:px-6">
          {sectionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-xl border border-sky-200/60 bg-white/70 px-3 py-1.5 text-slate-700 transition hover:border-sky-300/70 hover:bg-sky-100/70"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/team"
            className="whitespace-nowrap rounded-xl border border-sky-200/60 bg-white/70 px-3 py-1.5 text-slate-700 transition hover:border-sky-300/70 hover:bg-sky-100/70"
          >
            Team
          </Link>
        </nav>
      ) : null}
    </header>
  );
};
