import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis,
} from "recharts";
import {
  FaArrowRight, FaBolt, FaChartLine, FaCheck, FaFileInvoiceDollar,
  FaGlobe, FaRedo, FaShieldAlt,
} from "react-icons/fa";
import BrandMark from "../components/BrandMark";

const revenuePreview = [
  { month: "Jan", revenue: 32 }, { month: "Feb", revenue: 39 },
  { month: "Mar", revenue: 35 }, { month: "Apr", revenue: 48 },
  { month: "May", revenue: 54 }, { month: "Jun", revenue: 68 },
  { month: "Jul", revenue: 64 }, { month: "Aug", revenue: 82 },
  { month: "Sep", revenue: 91 }, { month: "Oct", revenue: 106 },
  { month: "Nov", revenue: 119 }, { month: "Dec", revenue: 136 },
];

const features = [
  { icon: FaBolt, title: "Recurring billing", body: "Run monthly and annual billing cycles with trials, renewals, and plan changes." },
  { icon: FaFileInvoiceDollar, title: "Invoices in sync", body: "Generate invoices from subscriptions and keep payment status easy to follow." },
  { icon: FaRedo, title: "Payment recovery", body: "Schedule retries after failed payments and keep customers informed." },
  { icon: FaChartLine, title: "Revenue insight", body: "Track collections, active subscriptions, and open invoices in one operations view." },
  { icon: FaShieldAlt, title: "Role based access", body: "Give admins billing controls and customers a focused self service portal." },
  { icon: FaGlobe, title: "Customer portal", body: "Let subscribers browse plans, manage subscriptions, and review invoices." },
];

const steps = [
  { n: "01", title: "Set up your catalog", body: "Create plans with clear prices, billing intervals, and trial periods." },
  { n: "02", title: "Bring customers in", body: "Customers register, choose a plan, and start a subscription." },
  { n: "03", title: "Let billing run", body: "Invoices, payment updates, and retry schedules follow each billing cycle." },
];

function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void text-ink">
      <header className="sticky top-0 z-40 border-b border-brand/15 bg-void/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <BrandMark light />
          <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
            <a href="#product" className="hover:text-brand">Product</a>
            <a href="#how" className="hover:text-brand">How it works</a>
            <a href="#insights" className="hover:text-brand">Insights</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="text-sm font-medium text-ink-soft hover:text-brand">Sign in</Link>
            <Link to="/register" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-void shadow-lg shadow-brand/20 hover:bg-brand-dark">Get started</Link>
          </div>
          <button className="text-sm text-brand md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}>Menu</button>
        </div>
        {open && <div className="space-y-3 border-t border-brand/15 px-5 py-4 text-sm text-ink md:hidden">
          <a href="#product" className="block" onClick={() => setOpen(false)}>Product</a>
          <a href="#how" className="block" onClick={() => setOpen(false)}>How it works</a>
          <a href="#insights" className="block" onClick={() => setOpen(false)}>Insights</a>
          <Link to="/login" className="block">Sign in</Link>
          <Link to="/register" className="block font-semibold text-brand">Get started</Link>
        </div>}
      </header>

      <main>
        <section className="mesh-bg relative overflow-hidden">
          <div className="grid-fade pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-gold-dim px-3 py-1 text-xs font-medium text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Subscription billing, in one clear view</p>
              <h1 className="font-display mt-6 text-5xl leading-[1.12] text-ink md:text-6xl">Make recurring revenue feel <span className="text-brand">straightforward.</span></h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-ink-soft">BillSphere brings plans, subscriptions, invoices, and payment recovery together, so your team can spend less time chasing billing details.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-void hover:bg-brand-dark">Create your workspace <FaArrowRight className="text-xs" /></Link>
                <Link to="/login" className="inline-flex items-center rounded-full border border-brand/35 px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-dim">Sign in</Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-soft"><span className="flex items-center gap-2"><FaCheck className="text-brand" /> Customer and admin portals</span><span className="flex items-center gap-2"><FaCheck className="text-brand" /> Automated billing workflows</span></div>
            </div>

            <div className="relative" aria-label="BillSphere revenue dashboard preview">
              <div className="absolute -inset-5 rounded-[32px] bg-brand/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-brand/25 bg-surface shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between border-b border-brand/15 px-5 py-4">
                  <div><p className="text-sm font-semibold text-ink">Revenue overview</p><p className="mt-1 text-xs text-ink-soft">A clearer view of your billing health</p></div>
                  <span className="rounded-full border border-brand/20 bg-gold-dim px-3 py-1 text-[11px] text-brand">Year to date</span>
                </div>
                <div className="grid grid-cols-3 gap-3 px-5 pt-5">
                  {[ ["Monthly revenue", "₹12.4L", "+12.8%"], ["Active subs", "1,248", "+8.2%"], ["Collected", "98.6%", "+2.4%"] ].map(([label, value, delta]) => <div key={label} className="rounded-2xl border border-brand/10 bg-void/80 p-3 sm:p-4"><p className="text-[10px] uppercase tracking-wider text-ink-soft">{label}</p><p className="mt-2 text-lg font-semibold text-ink sm:text-2xl">{value}</p><p className="mt-1 text-[11px] text-emerald-400">{delta} this month</p></div>)}
                </div>
                <div className="px-3 pb-2 pt-5 sm:px-5">
                  <div className="mb-2 flex items-center justify-between px-1"><p className="text-xs font-medium text-ink-soft">Revenue collected</p><p className="text-xs text-ink-soft">Last 12 months</p></div>
                  <div className="h-44 w-full sm:h-52">
                    <ResponsiveContainer width="100%" height="100%"><AreaChart data={revenuePreview} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                      <defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e0b84c" stopOpacity={0.3} /><stop offset="95%" stopColor="#e0b84c" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid stroke="rgba(224,184,76,.1)" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9d906e", fontSize: 10 }} interval={1} />
                      <Tooltip contentStyle={{ background: "#151310", border: "1px solid rgba(224,184,76,.25)", borderRadius: 12, color: "#f6e7c1" }} formatter={(value) => [`₹${value}k`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#e0b84c" strokeWidth={2.5} fill="url(#revenueFill)" />
                    </AreaChart></ResponsiveContainer>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 px-5 py-3 text-xs text-ink-soft"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Payments healthy</span><span>Invoices · subscriptions · retries</span></div>
              </div>
              <p className="relative mt-3 text-center text-[11px] text-ink-soft/70">Illustrative dashboard preview</p>
            </div>
          </div>
        </section>

        <section className="border-y border-brand/15 bg-surface py-7">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft"><span>Customer management</span><span>Plans &amp; cycles</span><span>Subscriptions</span><span>Invoices &amp; payments</span><span>Retry automation</span></div>
        </section>

        <section id="product" className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">The platform</p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl text-ink">The moving parts of billing, working together.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">From the first plan selection to a successful renewal, BillSphere keeps the subscription lifecycle organized for your customers and your operations team.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-2xl border border-brand/15 bg-surface p-6 transition hover:-translate-y-1 hover:border-brand/35"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gold-dim text-brand"><Icon /></div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-soft">{body}</p></article>)}</div>
        </section>

        <section id="insights" className="border-y border-brand/15 bg-surface py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Built for visibility</p><h2 className="font-display mt-3 text-4xl">Know what is happening across every billing cycle.</h2><p className="mt-4 leading-7 text-ink-soft">A practical operations dashboard brings customer, subscription, invoice, and payment activity into a single workflow. Find what needs attention and follow the trail from invoice to payment.</p><ul className="mt-6 space-y-3 text-sm text-ink-soft">{["See collected revenue and active subscriptions", "Spot open invoices and failed payments", "Review customer and payment history"].map((item) => <li key={item} className="flex items-center gap-2"><FaCheck className="text-brand" />{item}</li>)}</ul></div>
            <div className="rounded-3xl border border-brand/20 bg-void p-6 sm:p-8"><div className="flex items-start justify-between"><div><p className="text-sm text-ink-soft">Billing lifecycle</p><h3 className="mt-1 text-xl font-semibold">One connected workflow</h3></div><FaChartLine className="text-xl text-brand" /></div><div className="mt-7 space-y-3">{[["01", "Customer chooses a plan", "Account and subscription are created"], ["02", "Invoice is generated", "The billing cycle records what is due"], ["03", "Payment is processed", "Success or retry updates the lifecycle"]].map(([number, title, description], index) => <div key={number} className="flex gap-4 rounded-2xl border border-brand/10 bg-surface p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-dim text-xs font-semibold text-brand">{number}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-ink-soft">{description}</p></div>{index < 2 && <span className="sr-only">then</span>}</div>)}</div></div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-5 py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">How it works</p><h2 className="font-display mt-3 text-4xl">A simple path from signup to renewal.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{steps.map((step) => <div key={step.n} className="rounded-2xl border border-brand/15 bg-surface p-6"><p className="text-sm font-semibold text-brand">{step.n}</p><h3 className="mt-3 text-xl font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-ink-soft">{step.body}</p></div>)}</div></section>

        <section id="pricing" className="border-y border-brand/15 bg-surface py-20"><div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Flexible catalog</p><h2 className="font-display mt-3 text-4xl">Plans that fit the way you sell.</h2><p className="mt-4 leading-7 text-ink-soft">Set up monthly or annual billing, configure trials, and keep the active catalog available in the customer portal. Your customers can choose a plan that fits.</p><ul className="mt-6 space-y-3 text-sm text-ink-soft">{["Monthly and annual intervals", "Trial periods and subscription lifecycle", "Self service customer portal"].map((item) => <li key={item} className="flex items-center gap-2"><FaCheck className="text-brand" />{item}</li>)}</ul></div><div className="rounded-3xl border border-brand/25 bg-void p-8 shadow-xl"><p className="text-sm text-ink-soft">Your billing, clearly organized</p><p className="font-display mt-3 text-3xl font-semibold text-brand">One platform. Every cycle.</p><p className="mt-4 text-sm leading-6 text-ink-soft">Bring plans, customer subscriptions, invoices, and payment activity into one reliable view.</p><Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-void hover:bg-brand-dark">Explore BillSphere <FaArrowRight className="text-xs" /></Link></div></div></section>

        <section className="px-5 py-20"><div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-brand/25 bg-surface px-8 py-14 text-center"><h2 className="font-display text-4xl text-ink md:text-5xl">Bring clarity to your subscription operations.</h2><p className="mx-auto mt-4 max-w-xl text-ink-soft">Give your team the tools to manage billing, while customers stay in control of their subscriptions.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/register" className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-void">Create an account</Link><Link to="/login" className="rounded-full border border-brand/35 px-5 py-3 text-sm font-semibold text-ink">Sign in</Link></div></div></section>
      </main>
      <footer className="border-t border-brand/15 bg-void py-8"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-ink-soft sm:flex-row"><BrandMark light /><p>© {new Date().getFullYear()} BillSphere. Billing, made clear.</p></div></footer>
    </div>
  );
}

export default Landing;
