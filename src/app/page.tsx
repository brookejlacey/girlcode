"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import IntakeForm from "@/components/IntakeForm";

/* ── floating code symbols ──────────────────────────────────────── */
const SYMBOLS = [
  { t: "{ }",  x: "6%",  d: "0s",  dur: "38s", sz: "1.3rem" },
  { t: "</>",  x: "17%", d: "5s",  dur: "42s", sz: "1.1rem" },
  { t: "=>",   x: "28%", d: "12s", dur: "35s", sz: "1.5rem" },
  { t: "//",   x: "41%", d: "2s",  dur: "40s", sz: "1rem"  },
  { t: "()",   x: "55%", d: "8s",  dur: "37s", sz: "1.4rem" },
  { t: "&&",   x: "66%", d: "15s", dur: "44s", sz: "1.1rem" },
  { t: "[]",   x: "77%", d: "1s",  dur: "39s", sz: "1.3rem" },
  { t: "fn",   x: "87%", d: "10s", dur: "41s", sz: "1rem"  },
  { t: "::",   x: "34%", d: "7s",  dur: "36s", sz: "1.2rem" },
  { t: "**",   x: "94%", d: "13s", dur: "43s", sz: "1.1rem" },
];

/* ── scroll-triggered reveal wrapper ────────────────────────────── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────────── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  /* mouse tracking: hero parallax + cursor spotlight */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      /* hero parallax */
      if (heroRef.current) {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        heroRef.current.style.setProperty("--px", `${x * -15}px`);
        heroRef.current.style.setProperty("--py", `${y * -10}px`);
      }
      /* cursor spotlight */
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${e.clientX}px`;
        spotlightRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="relative min-h-screen font-sans grain">
      {/* ── animated mesh background ─────────────────────────────── */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      {/* ── floating code symbols ────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[1] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {SYMBOLS.map((s, i) => (
          <span
            key={i}
            className="code-symbol"
            style={{
              left: s.x,
              fontSize: s.sz,
              animationDelay: s.d,
              animationDuration: s.dur,
            }}
          >
            {s.t}
          </span>
        ))}
      </div>

      {/* ── cursor spotlight (desktop only) ──────────────────────── */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed z-[2] hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:block"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.07), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── content ──────────────────────────────────────────────── */}
      <div className="relative z-10">
        {/* ── nav ──────────────────────────────────────────────── */}
        <nav className="fixed top-0 z-50 w-full p-3 sm:p-4">
          <div className="glass mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-5 py-3">
            <a
              href="#"
              className="gradient-text text-lg font-semibold tracking-tight"
            >
              girl code<span className="period-glow">.</span>
            </a>

            <div className="hidden items-center gap-6 text-sm sm:flex">
              <a
                href="#services"
                className="nav-link text-muted-light transition-colors hover:text-foreground"
              >
                Services
              </a>
              <a
                href="#about"
                className="nav-link text-muted-light transition-colors hover:text-foreground"
              >
                About
              </a>
              <a
                href="/launch"
                className="nav-link text-muted-light transition-colors hover:text-foreground"
              >
                Launch
              </a>
              <a
                href="#intake"
                className="btn-gradient rounded-lg px-4 py-2 text-sm font-medium text-white"
              >
                Work With Us
              </a>
            </div>

            {/* mobile toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-light transition-colors hover:text-foreground sm:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* mobile menu */}
          {menuOpen && (
            <div className="glass mx-3 mt-2 rounded-2xl p-5 sm:hidden">
              <div className="flex flex-col gap-4 text-sm">
                <a
                  href="#services"
                  onClick={() => setMenuOpen(false)}
                  className="text-muted-light transition-colors hover:text-foreground"
                >
                  Services
                </a>
                <a
                  href="#about"
                  onClick={() => setMenuOpen(false)}
                  className="text-muted-light transition-colors hover:text-foreground"
                >
                  About
                </a>
                <a
                  href="/launch"
                  onClick={() => setMenuOpen(false)}
                  className="text-muted-light transition-colors hover:text-foreground"
                >
                  Launch
                </a>
                <a
                  href="#intake"
                  onClick={() => setMenuOpen(false)}
                  className="btn-gradient rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
                >
                  Work With Us
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* ── hero ─────────────────────────────────────────────── */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-20">
          <Reveal className="text-center">
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-muted-light sm:text-sm">
              Fractional Tech Leadership
            </p>
          </Reveal>

          <Reveal delay={150}>
            <h1
              ref={heroRef}
              className="hero-title gradient-text mb-8 text-center text-5xl font-bold leading-[0.92] tracking-tighter sm:text-7xl md:text-8xl lg:text-[9rem]"
            >
              45 years.
              <br />
              Zero fluff.
            </h1>
          </Reveal>

          <Reveal delay={300} className="mx-auto max-w-2xl text-center">
            <p className="mb-12 text-base leading-relaxed text-muted-light sm:text-lg md:text-xl">
              Girl Code is a fractional CTO and technical consulting partnership.
              We bring full-time leadership and execution at a fraction of the
              cost&mdash;because we&apos;ve already built it, broken it, and
              shipped&nbsp;it.
            </p>
          </Reveal>

          <Reveal
            delay={450}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <a
              href="#intake"
              className="btn-gradient rounded-xl px-8 py-4 font-medium text-white"
            >
              Start a Conversation
            </a>
            <a
              href="#services"
              className="btn-glass rounded-xl px-8 py-4 font-medium text-foreground"
            >
              See What We Do
            </a>
          </Reveal>
        </section>

        {/* divider */}
        <div className="section-divider mx-auto w-full max-w-5xl" />

        {/* ── services ─────────────────────────────────────────── */}
        <section id="services" className="px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-pink sm:text-sm">
                What We Do
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Three arms.
                <br />
                <span className="gradient-text">One mission.</span>
              </h2>
              <p className="mb-16 max-w-2xl text-base text-muted-light sm:text-lg">
                We build, we ship, and we tell the story. Girl Code operates
                across consulting, development, and media&mdash;and every arm
                reinforces the others.
              </p>
            </Reveal>

            <div className="space-y-2">
              {/* Consulting */}
              <Reveal delay={100}>
                <div className="service-item group cursor-default rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                    <span className="gradient-text flex-shrink-0 font-mono text-4xl font-bold sm:text-5xl">
                      01
                    </span>
                    <div className="flex-1">
                      <div className="gradient-line mb-4 w-full" />
                      <h3 className="mb-2 text-xl font-semibold sm:text-2xl">
                        Consulting
                      </h3>
                      <p className="mb-5 max-w-xl text-muted-light">
                        Fractional CTO and technical leadership for teams that
                        need senior engineering guidance without the full-time
                        overhead.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Architecture & system design",
                          "Team building & culture",
                          "AI integration strategy",
                          "Web3 & blockchain",
                        ].map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-muted-light"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Development */}
              <Reveal delay={200}>
                <div className="service-item group cursor-default rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                    <span className="gradient-text flex-shrink-0 font-mono text-4xl font-bold sm:text-5xl">
                      02
                    </span>
                    <div className="flex-1">
                      <div className="gradient-line mb-4 w-full" />
                      <h3 className="mb-2 text-xl font-semibold sm:text-2xl">
                        Development
                      </h3>
                      <p className="mb-5 max-w-xl text-muted-light">
                        Full-stack application development. We build products
                        from zero to launch, shipping fast without cutting
                        corners.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Web & mobile apps",
                          "AI-powered applications",
                          "Smart contracts & dApps",
                          "Hackathon projects & MVPs",
                        ].map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-muted-light"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Media */}
              <Reveal delay={300}>
                <div className="service-item group cursor-default rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                    <span className="gradient-text flex-shrink-0 font-mono text-4xl font-bold sm:text-5xl">
                      03
                    </span>
                    <div className="flex-1">
                      <div className="gradient-line mb-4 w-full" />
                      <h3 className="mb-2 text-xl font-semibold sm:text-2xl">
                        Media
                      </h3>
                      <p className="mb-5 max-w-xl text-muted-light">
                        Building in public. We document the journey through live
                        streams, podcasts, and social content&mdash;educating
                        while we ship.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Weekly live streams",
                          "Girl Code podcast",
                          "Build-in-public content",
                          "Tech education & community",
                        ].map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-muted-light"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* divider */}
        <div className="section-divider mx-auto w-full max-w-5xl" />

        {/* ── about ────────────────────────────────────────────── */}
        <section id="about" className="px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-5 md:gap-16">
              <div className="md:col-span-3">
                <Reveal>
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-pink sm:text-sm">
                    Who We Are
                  </p>
                  <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-5xl">
                    Two engineers.
                    <br />
                    <span className="gradient-text">
                      One unfair advantage.
                    </span>
                  </h2>
                </Reveal>

                <Reveal delay={150}>
                  <p className="mb-5 text-base leading-relaxed text-muted-light sm:text-lg">
                    Girl Code is{" "}
                    <strong className="font-semibold text-foreground">
                      Brooke Lacey
                    </strong>{" "}
                    and{" "}
                    <strong className="font-semibold text-foreground">
                      Nicki Sanders
                    </strong>
                    &mdash;a partnership built on 45+ years of combined
                    engineering experience spanning full-stack development,
                    blockchain, AI, content creation, and technical leadership.
                  </p>
                </Reveal>

                <Reveal delay={250}>
                  <p className="mb-5 text-base leading-relaxed text-muted-light sm:text-lg">
                    We&apos;ve been indie developers, team leads, content
                    creators, and builders. We&apos;ve shipped products, won
                    hackathons, and led engineering teams. Now we&apos;re
                    combining everything under one roof.
                  </p>
                </Reveal>

                <Reveal delay={350}>
                  <p className="text-base leading-relaxed text-muted-light sm:text-lg">
                    Our unfair advantage?{" "}
                    <span className="text-foreground">
                      We build in public.
                    </span>{" "}
                    You get to watch us work, learn from our process, and see
                    exactly how we think. Transparency isn&apos;t a marketing
                    play&mdash;it&apos;s how we operate.
                  </p>
                </Reveal>
              </div>

              <div className="flex flex-col gap-4 md:col-span-2">
                <Reveal delay={200}>
                  <div className="stat-card rounded-2xl p-6">
                    <p className="gradient-text mb-1 text-4xl font-bold">45+</p>
                    <p className="text-sm text-muted-light">
                      Years of combined experience
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={300}>
                  <div className="stat-card rounded-2xl p-6">
                    <p className="gradient-text mb-1 text-4xl font-bold">
                      Full&#8209;stack
                    </p>
                    <p className="text-sm text-muted-light">
                      Web, mobile, blockchain, AI, infrastructure
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={400}>
                  <div className="stat-card rounded-2xl p-6">
                    <p className="gradient-text mb-1 text-4xl font-bold">
                      Fractional
                    </p>
                    <p className="text-sm text-muted-light">
                      Senior leadership at a fraction of the cost
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* divider */}
        <div className="section-divider mx-auto w-full max-w-5xl" />

        {/* ── intake / CTA ─────────────────────────────────────── */}
        <section id="intake" className="px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-pink sm:text-sm">
                Let&apos;s Talk
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Start with a
                <br />
                <span className="gradient-text">conversation.</span>
              </h2>
              <p className="mb-10 max-w-xl text-base text-muted-light sm:text-lg">
                Tell us about your project and we&apos;ll set up a discovery
                call. No hard sell, no BS&mdash;just a real conversation about
                what you need and whether we&apos;re the right fit.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="glass rounded-2xl p-6 sm:p-10">
                <IntakeForm />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── footer ───────────────────────────────────────────── */}
        <footer className="border-t border-glass-border px-6 py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted sm:text-sm">
              &copy; {new Date().getFullYear()} Girl Code. All rights reserved.
            </p>
            <a
              href="https://girlcode.technology"
              className="font-mono text-xs text-muted transition-colors hover:text-foreground sm:text-sm"
            >
              girlcode.technology
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
