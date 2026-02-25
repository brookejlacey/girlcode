"use client";

import { useState } from "react";
import IntakeForm from "@/components/IntakeForm";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="text-lg font-semibold tracking-tight">
            girl code<span className="text-accent">.</span>
          </a>
          <div className="hidden items-center gap-8 text-sm sm:flex">
            <a
              href="#services"
              className="text-muted transition-colors hover:text-foreground"
            >
              Services
            </a>
            <a
              href="#about"
              className="text-muted transition-colors hover:text-foreground"
            >
              About
            </a>
            <a
              href="/launch"
              className="text-muted transition-colors hover:text-foreground"
            >
              Launch
            </a>
            <a
              href="#intake"
              className="rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-light"
            >
              Work With Us
            </a>
          </div>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-foreground sm:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-6 py-4 sm:hidden">
            <div className="flex flex-col gap-4 text-sm">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted transition-colors hover:text-foreground"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted transition-colors hover:text-foreground"
              >
                About
              </a>
              <a
                href="/launch"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted transition-colors hover:text-foreground"
              >
                Launch
              </a>
              <a
                href="#intake"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-accent px-4 py-2 text-center text-white transition-colors hover:bg-accent-light"
              >
                Work With Us
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
            Fractional Tech Leadership
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            45+ years of engineering.
            <br />
            <span className="text-muted">Zero fluff.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted">
            Girl Code is a fractional CTO and technical consulting partnership.
            We bring full-time leadership and execution at a fraction of the
            cost &mdash; because we&apos;ve already built it, broken it, and
            shipped it.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#intake"
              className="rounded-lg bg-accent px-8 py-3.5 font-medium text-white transition-colors hover:bg-accent-light"
            >
              Start a Conversation
            </a>
            <a
              href="#services"
              className="rounded-lg border border-border px-8 py-3.5 font-medium transition-colors hover:bg-card"
            >
              See What We Do
            </a>
          </div>
        </div>
      </section>

      {/* Services / Three Pillars */}
      <section id="services" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            What We Do
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Three arms. One mission.
          </h2>
          <p className="mb-16 max-w-2xl text-lg text-muted">
            We build, we ship, and we tell the story. Girl Code operates across
            consulting, development, and media &mdash; and every arm reinforces
            the others.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Consulting */}
            <div className="group rounded-2xl border border-border bg-card p-8 transition-colors hover:border-accent/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 font-mono text-xl text-accent">
                &gt;_
              </div>
              <h3 className="mb-2 text-xl font-semibold">Consulting</h3>
              <p className="mb-4 text-muted">
                Fractional CTO and technical leadership for teams that need
                senior engineering guidance without the full-time overhead.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Architecture & system design
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Team building & engineering culture
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  AI integration strategy
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Web3 & blockchain consulting
                </li>
              </ul>
            </div>

            {/* App Development */}
            <div className="group rounded-2xl border border-border bg-card p-8 transition-colors hover:border-accent/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 font-mono text-xl text-accent">
                {}
              </div>
              <h3 className="mb-2 text-xl font-semibold">Development</h3>
              <p className="mb-4 text-muted">
                Full-stack application development. We build products from zero
                to launch, shipping fast without cutting corners.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Web & mobile apps
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  AI-powered applications
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Smart contracts & dApps
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Hackathon projects & MVPs
                </li>
              </ul>
            </div>

            {/* Media */}
            <div className="group rounded-2xl border border-border bg-card p-8 transition-colors hover:border-accent/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 font-mono text-xl text-accent">
                &#9654;
              </div>
              <h3 className="mb-2 text-xl font-semibold">Media</h3>
              <p className="mb-4 text-muted">
                Building in public. We document the journey through live
                streams, podcasts, and social content &mdash; educating while we
                ship.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Weekly live streams
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Girl Code podcast
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Build-in-public content
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">&bull;</span>
                  Tech education & community
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
                Who We Are
              </p>
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Two engineers.
                <br />
                One unfair advantage.
              </h2>
              <p className="mb-4 text-lg text-muted">
                Girl Code is Brooke Lacey and Nicki Sanders &mdash; a
                partnership built on 45+ years of combined engineering
                experience spanning full-stack development, blockchain, AI,
                content creation, and technical leadership.
              </p>
              <p className="mb-4 text-lg text-muted">
                We&apos;ve been indie developers, team leads, content creators,
                and builders. We&apos;ve shipped products, won hackathons, and
                led engineering teams. Now we&apos;re combining everything under
                one roof.
              </p>
              <p className="text-lg text-muted">
                Our unfair advantage? We build in public. You get to watch us
                work, learn from our process, and see exactly how we think.
                Transparency isn&apos;t a marketing play &mdash; it&apos;s how
                we operate.
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="mb-1 text-3xl font-bold">45+</p>
                <p className="text-muted">Years of combined experience</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="mb-1 text-3xl font-bold">Full-stack</p>
                <p className="text-muted">
                  Web, mobile, blockchain, AI, infrastructure
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="mb-1 text-3xl font-bold">Fractional</p>
                <p className="text-muted">
                  Senior leadership at a fraction of the cost
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Intake Form */}
      <section id="intake" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            Let&apos;s Talk
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Start with a conversation.
          </h2>
          <p className="mb-10 text-lg text-muted">
            Tell us about your project and we&apos;ll set up a discovery call.
            No hard sell, no BS &mdash; just a real conversation about what you
            need and whether we&apos;re the right fit.
          </p>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
            <IntakeForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Girl Code. All rights reserved.
          </p>
          <a href="https://girlcode.technology" className="font-mono text-sm text-muted hover:text-foreground transition-colors">girlcode.technology</a>
        </div>
      </footer>
    </div>
  );
}
