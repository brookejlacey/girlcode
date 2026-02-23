"use client";

import { useState, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  service_type: string;
  description: string;
  budget: string;
  timeline: string;
  referral_source: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  company: "",
  role: "",
  service_type: "",
  description: "",
  budget: "",
  timeline: "",
  referral_source: "",
};

export default function IntakeForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "equity_only" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.equity_only) {
        setStatus("equity_only");
        setMessage(data.message);
      } else if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setFormData(initialFormData);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mb-4 text-4xl">&#10003;</div>
        <h3 className="mb-2 text-xl font-semibold">We&apos;ll be in touch.</h3>
        <p className="text-muted">{message}</p>
      </div>
    );
  }

  if (status === "equity_only") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold">
          Thank you for your interest.
        </h3>
        <p className="mb-4 text-muted">{message}</p>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData(initialFormData);
          }}
          className="text-accent-light underline underline-offset-4 hover:text-accent"
        >
          Submit a different inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium"
          >
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium"
          >
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="mb-1.5 block text-sm font-medium"
          >
            Company / Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Your company"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-1.5 block text-sm font-medium"
          >
            Your Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="CEO, Founder, CTO, etc."
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="service_type"
          className="mb-1.5 block text-sm font-medium"
        >
          What do you need? <span className="text-accent">*</span>
        </label>
        <select
          id="service_type"
          name="service_type"
          required
          value={formData.service_type}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Select a service</option>
          <option value="fractional_cto">Fractional CTO / Tech Leadership</option>
          <option value="technical_consulting">Technical Consulting</option>
          <option value="app_development">App Development</option>
          <option value="ai_integration">AI Integration & Strategy</option>
          <option value="web3_blockchain">Web3 / Blockchain Development</option>
          <option value="media_content">Media & Content Strategy</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium"
        >
          Tell us about your project <span className="text-accent">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          placeholder="What are you building? What challenges are you facing? What does success look like?"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="budget"
            className="mb-1.5 block text-sm font-medium"
          >
            Budget Range <span className="text-accent">*</span>
          </label>
          <select
            id="budget"
            name="budget"
            required
            value={formData.budget}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select your budget</option>
            <option value="5k_15k">$5,000 - $15,000</option>
            <option value="15k_30k">$15,000 - $30,000</option>
            <option value="30k_50k">$30,000 - $50,000</option>
            <option value="50k_100k">$50,000 - $100,000</option>
            <option value="100k_plus">$100,000+</option>
            <option value="equity_only">Equity Only (no cash budget)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timeline"
            className="mb-1.5 block text-sm font-medium"
          >
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select timeline</option>
            <option value="asap">ASAP</option>
            <option value="1_3_months">1 - 3 months</option>
            <option value="3_6_months">3 - 6 months</option>
            <option value="6_plus_months">6+ months</option>
            <option value="ongoing">Ongoing / Retainer</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="referral_source"
          className="mb-1.5 block text-sm font-medium"
        >
          How did you hear about us?
        </label>
        <input
          type="text"
          id="referral_source"
          name="referral_source"
          value={formData.referral_source}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Social media, referral, podcast, etc."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
      >
        {status === "submitting" ? "Submitting..." : "Request a Discovery Call"}
      </button>

      <p className="text-xs text-muted">
        We&apos;ll review your submission and reach out to schedule a formal
        discovery call. No spam, ever.
      </p>
    </form>
  );
}
