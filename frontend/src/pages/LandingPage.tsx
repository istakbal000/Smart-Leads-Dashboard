import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  ChevronRight,
  Target,
  Globe,
  Bell,
} from 'lucide-react';

/* ─── tiny counter hook ─────────────────────────────────────── */
function useCounter(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

/* ─── static data ───────────────────────────────────────────── */
const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Track conversion rates, pipeline health and revenue forecasts with live charts.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Assign leads, set roles and keep every rep aligned — all in one workspace.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Built on a modern stack so pages load instantly, even with thousands of leads.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'JWT-based auth, role-based access and encrypted data — secure by design.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Target,
    title: 'Smart Filtering',
    desc: 'Slice your pipeline by status, source, date and rep with a single click.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Globe,
    title: 'Multi-Source Tracking',
    desc: 'Capture leads from website, Instagram, referrals and more — unified in one view.',
    color: 'from-indigo-500 to-blue-600',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VP Sales, Axon Ventures',
    avatar: 'SC',
    text: 'SmartLeads cut our pipeline review time by 60%. The analytics alone are worth it.',
    stars: 5,
  },
  {
    name: 'James Okonkwo',
    role: 'Founder, GrowthStack',
    avatar: 'JO',
    text: 'Finally a CRM that doesn\'t feel like filing taxes. The UI is beautiful and fast.',
    stars: 5,
  },
  {
    name: 'Priya Mehta',
    role: 'Sales Lead, Helio SaaS',
    avatar: 'PM',
    text: 'Role-based access was a game changer for us. Reps only see what they need.',
    stars: 5,
  },
];

/* ─── mini bar chart preview ────────────────────────────────── */
const HeroMockup = () => (
  <div className="relative w-full max-w-lg mx-auto">
    {/* glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-cyan-600/20 blur-3xl rounded-3xl" />
    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-bold text-sm">Lead Pipeline</span>
        <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">↑ 24% this week</span>
      </div>
      {/* bars */}
      <div className="flex items-end gap-2 h-28 mb-4">
        {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <div
              className="rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 transition-all"
              style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
            />
          </div>
        ))}
      </div>
      {/* status pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'New', color: 'bg-blue-500/20 text-blue-300', count: 24 },
          { label: 'Qualified', color: 'bg-emerald-500/20 text-emerald-300', count: 18 },
          { label: 'Contacted', color: 'bg-amber-500/20 text-amber-300', count: 12 },
          { label: 'Lost', color: 'bg-rose-500/20 text-rose-300', count: 3 },
        ].map((s) => (
          <span key={s.label} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
            {s.label} · {s.count}
          </span>
        ))}
      </div>
    </div>
    {/* floating cards */}
    <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3 flex items-center gap-2 shadow-lg">
      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
      </div>
      <div>
        <p className="text-white text-xs font-bold">Conversion</p>
        <p className="text-emerald-400 text-xs">+12% ↑</p>
      </div>
    </div>
    <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3 flex items-center gap-2 shadow-lg">
      <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
        <Bell className="w-4 h-4 text-violet-400" />
      </div>
      <div>
        <p className="text-white text-xs font-bold">New lead</p>
        <p className="text-slate-300 text-xs">Just now</p>
      </div>
    </div>
  </div>
);

/* ─── main component ────────────────────────────────────────── */
const LandingPage: React.FC = () => {
  const leads   = useCounter(12400);
  const users   = useCounter(2300);
  const uptime  = useCounter(99);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">SmartLeads</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#stats" className="hover:text-white transition-colors">Stats</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* bg blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center py-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5" />
              The modern CRM for lean sales teams
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
              Turn every lead into{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                revenue
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
              SmartLeads gives your sales team a single place to capture, track, and convert
              leads — with real-time analytics and role-based access built in from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-violet-500/25"
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-all"
              >
                Sign in <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-slate-500">
              {['No credit card required', 'Free forever plan', 'Deploy in 60 seconds'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="py-20 border-y border-white/5 bg-white/2">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: `${leads.toLocaleString()}+`, label: 'Leads tracked' },
            { value: `${users.toLocaleString()}+`, label: 'Active users' },
            { value: `${uptime}%`, label: 'Uptime SLA' },
            { value: '4.9★', label: 'Avg rating' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                {s.value}
              </p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Everything your team needs</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From first touch to closed deal — SmartLeads covers every step of your pipeline.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/6 hover:border-white/15 transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-28 bg-white/2 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black">Loved by sales teams</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/4 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 max-w-4xl mx-auto px-6 text-center">
        <div className="relative bg-gradient-to-br from-violet-900/50 to-cyan-900/30 border border-white/10 rounded-3xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-600/10 blur-2xl" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to grow your pipeline?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join thousands of sales professionals already using SmartLeads to close more deals, faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 font-bold text-white hover:opacity-90 transition-all shadow-xl shadow-violet-500/25 text-sm"
              >
                Create free account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/8 border border-white/15 font-semibold hover:bg-white/12 transition-all text-sm"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-sm max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-slate-400">SmartLeads</span>
        </div>
        <p>© {new Date().getFullYear()} SmartLeads. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
          <Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
