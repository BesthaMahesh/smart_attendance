import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Camera, FileSpreadsheet, Users, Monitor, BarChart3, CloudLightning, 
  CheckCircle2, ArrowRight, Play, Globe, Shield, Sparkles, Phone, Mail, MapPin,
  GraduationCap, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    {
      icon: <Camera className="h-6 w-6 text-cyan-600" />,
      title: "Face Recognition",
      description: "Fast, contactless classroom attendance marking using edge facial feature mapping."
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-indigo-600" />,
      title: "Real-Time Reports",
      description: "Gain valuable academic insights and view comprehensive, auto-generated attendance summaries."
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Student Management",
      description: "Manage enrollment lists, track department histories, and configure personal profiles easily."
    },
    {
      icon: <Monitor className="h-6 w-6 text-teal-600" />,
      title: "Teacher Dashboard",
      description: "Single-click classroom scanner activation, manual roster overrides, and course planner."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-pink-600" />,
      title: "Detailed Analytics",
      description: "Identify attendance patterns, highlight risk ratios, and review monthly compliance trends."
    },
    {
      icon: <CloudLightning className="h-6 w-6 text-amber-600" />,
      title: "Secure Cloud Storage",
      description: "Leverages MongoDB database backends to ensure 99.9% data persistence and JWT request encryption."
    }
  ];

  const pricingTiers = [
    {
      name: "Starter Pack",
      priceMonthly: "₹99",
      priceYearly: "₹79",
      period: "month",
      description: "Perfect for individual tutors and private classrooms.",
      features: [
        "Up to 60 Students",
        "Unlimited Schedules",
        "AI Face & Voice Authentication",
        "Basic CSV Export Sheets",
        "Standard Email Support"
      ],
      cta: "Start Free Trial",
      popular: false,
      badge: "Budget Friendly"
    },
    {
      name: "Institution Pro",
      priceMonthly: "₹199",
      priceYearly: "₹159",
      period: "month",
      description: "Best for growing colleges and academic departments.",
      features: [
        "Up to 600 Students",
        "Dedicated Admin Console",
        "Multi-Teacher Class Rooms",
        "PDF & Excel Analytics Ledger",
        "MongoDB Seed Keys & API Integration",
        "Priority 24/7 Helpline Support"
      ],
      cta: "Get Started Now",
      popular: true,
      badge: "Most Popular"
    },
    {
      name: "Enterprise Hub",
      priceMonthly: "Custom",
      priceYearly: "Custom",
      period: "quote",
      description: "Complete ERP sync for multi-campus universities.",
      features: [
        "Unlimited Students & Courses",
        "Custom Mongoose DB Integration",
        "SSO & SAML Security Shield",
        "SLA Roster Guarantee",
        "LMS Roster Sync API Hook",
        "Dedicated Server Deployment"
      ],
      cta: "Contact Sales",
      popular: false,
      badge: "Enterprise"
    }
  ];

  return (
    <div id="home" className="min-h-screen bg-slate-50 flex flex-col scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy */}
            <div className="lg:col-span-6 flex flex-col space-y-6 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
              >
                <Sparkles className="h-3 w-3 mr-1" /> Version 2.0 (React + MongoDB)
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-tight tracking-tight text-slateCustom-900"
              >
                Smart Attendance <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-dark">
                  Tracking Made Simple
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slateCustom-600 max-w-xl mx-auto lg:mx-0"
              >
                Automate attendance management using modern technology, analytics, and real-time reporting. Designed for universities, colleges, and high-performance teams.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2"
              >
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-semibold text-white bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg transition-all"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slateCustom-200 rounded-xl text-base font-semibold text-slateCustom-700 bg-white hover:bg-slateCustom-50 shadow-sm hover:shadow transition-all"
                >
                  <Play className="mr-2 h-4.5 w-4.5 text-primary fill-primary" /> Watch Demo
                </button>
              </motion.div>

              {/* Badges row */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-3 gap-4 border-t border-slateCustom-200 pt-8 mt-4"
              >
                <div>
                  <div className="text-2xl font-bold text-slateCustom-900">99.9%</div>
                  <div className="text-xs text-slateCustom-500">Scan Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slateCustom-900">&lt; 3s</div>
                  <div className="text-xs text-slateCustom-500">Scan Speed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slateCustom-900">10k+</div>
                  <div className="text-xs text-slateCustom-500">Active Students</div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Simulated Dashboard Mock */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto max-w-lg lg:max-w-none bg-slateCustom-900 rounded-3xl p-4 shadow-2xl border border-slateCustom-800"
              >
                {/* Header buttons */}
                <div className="flex items-center justify-between pb-3 border-b border-slateCustom-800">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <div className="text-[10px] text-slateCustom-500 font-mono">dashboard_preview.io</div>
                  <div className="w-6"></div>
                </div>

                {/* Dashboard body grid */}
                <div className="grid grid-cols-12 gap-3 pt-3">
                  {/* Left panel */}
                  <div className="col-span-4 bg-slateCustom-950/40 rounded-xl p-3 border border-slateCustom-800/40 flex flex-col space-y-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="text-[9px] font-bold text-white tracking-wider uppercase font-display">Console</div>
                    </div>
                    <div className="h-1.5 w-12 bg-slateCustom-800 rounded-full mt-2"></div>
                    <div className="h-1.5 w-16 bg-slateCustom-800/50 rounded-full"></div>
                    <div className="h-1.5 w-14 bg-slateCustom-800/50 rounded-full"></div>
                    <div className="h-1.5 w-18 bg-slateCustom-800/50 rounded-full"></div>
                    <div className="h-1.5 w-10 bg-slateCustom-800/50 rounded-full"></div>
                    <div className="flex-grow"></div>
                    <div className="h-6 w-full rounded-md bg-slateCustom-800 flex items-center justify-center text-[8px] text-slateCustom-400">
                      Settings
                    </div>
                  </div>

                  {/* Right panel (main content) */}
                  <div className="col-span-8 flex flex-col space-y-3">
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slateCustom-950/45 rounded-xl p-2.5 border border-slateCustom-800/40 text-center">
                        <div className="text-[7px] text-slateCustom-400 font-medium">Students</div>
                        <div className="text-xs font-bold text-white mt-0.5">142</div>
                      </div>
                      <div className="bg-slateCustom-950/45 rounded-xl p-2.5 border border-slateCustom-800/40 text-center">
                        <div className="text-[7px] text-slateCustom-400 font-medium">Class Rate</div>
                        <div className="text-xs font-bold text-accent mt-0.5">94.2%</div>
                      </div>
                      <div className="bg-slateCustom-950/45 rounded-xl p-2.5 border border-slateCustom-800/40 text-center">
                        <div className="text-[7px] text-slateCustom-400 font-medium">Classes</div>
                        <div className="text-xs font-bold text-white mt-0.5">12</div>
                      </div>
                    </div>

                    {/* Chart simulator */}
                    <div className="bg-slateCustom-950/45 rounded-2xl p-3 border border-slateCustom-800/45 flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-semibold text-slateCustom-200">Attendance Trend</span>
                        <span className="text-[6px] text-slateCustom-500">Weekly</span>
                      </div>
                      <div className="h-24 flex items-end justify-between px-2 pt-2 border-b border-slateCustom-800">
                        <div className="w-5 bg-slateCustom-800 rounded-t-sm h-[60%]"></div>
                        <div className="w-5 bg-primary/80 rounded-t-sm h-[80%]"></div>
                        <div className="w-5 bg-slateCustom-800 rounded-t-sm h-[70%]"></div>
                        <div className="w-5 bg-accent/80 rounded-t-sm h-[95%]"></div>
                        <div className="w-5 bg-primary/80 rounded-t-sm h-[85%]"></div>
                      </div>
                      <div className="flex justify-between text-[6px] text-slateCustom-500 px-1 font-mono">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                      </div>
                    </div>

                    {/* Scanner widget simulator */}
                    <div className="bg-slateCustom-950/50 rounded-xl p-2.5 border border-slateCustom-800/50 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slateCustom-800 flex items-center justify-center border border-accent/20">
                          <Camera className="w-4.5 h-4.5 text-accent animate-pulse" />
                          <div className="absolute inset-x-0 h-0.5 bg-accent top-1/2 shadow-cyan-500 shadow animate-bounce"></div>
                        </div>
                        <div>
                          <div className="text-[8px] font-bold text-white">Classroom 402 AI Scan</div>
                          <div className="text-[6px] text-slateCustom-400">Processing live video...</div>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 bg-accent/20 border border-accent/40 rounded-full text-[6px] font-semibold text-accent animate-pulse">
                        Active
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-white border-y border-slateCustom-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-wider text-slateCustom-400 uppercase">Trusted by forward-thinking universities and academies</p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-12 grayscale opacity-60">
            <span className="text-lg font-bold text-slateCustom-800 tracking-tight font-display flex items-center">
              <Globe className="h-5 w-5 mr-1" /> MIT Tech
            </span>
            <span className="text-lg font-bold text-slateCustom-800 tracking-tight font-display flex items-center">
              <Shield className="h-5 w-5 mr-1" /> Stanford Labs
            </span>
            <span className="text-lg font-bold text-slateCustom-800 tracking-tight font-display flex items-center">
              <GraduationCap className="h-5 w-5 mr-1" /> Ivy Group
            </span>
            <span className="text-lg font-bold text-slateCustom-800 tracking-tight font-display flex items-center">
              <Monitor className="h-5 w-5 mr-1" /> Oxford Edu
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slateCustom-900 tracking-tight">
              AI-Powered Attendance Management
            </h2>
            <p className="text-lg text-slateCustom-600">
              Replace outdated paper logs and complex desktop spreadsheets with our web-based dashboard suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                className="bg-white rounded-2xl p-6 border border-slateCustom-200 transition-all flex flex-col space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slateCustom-50 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slateCustom-900 font-display">{feature.title}</h3>
                <p className="text-sm text-slateCustom-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slateCustom-200 scroll-mt-16 relative overflow-hidden">
        {/* Background Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-5 mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              🇮🇳 Special India Pricing (INR)
            </span>
            <h2 className="text-4xl sm:text-5xl font-black font-display text-slateCustom-900 tracking-tight leading-tight">
              Flexible Plans for Every Institution
            </h2>
            <p className="text-lg text-slateCustom-600 leading-relaxed max-w-2xl mx-auto">
              Sleek, transparent pricing designed specifically for Indian classrooms and educational budgets under ₹200.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <span className={`text-sm font-bold transition-colors duration-200 ${!isYearly ? 'text-slateCustom-900' : 'text-slateCustom-400'}`}>Monthly Billing</span>
              <button 
                type="button"
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-14 h-8 bg-slateCustom-900 rounded-full p-1 transition-colors duration-300 focus:outline-none hover:bg-slateCustom-850"
              >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-accent rounded-full shadow-md"
                  animate={{ x: isYearly ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold transition-colors duration-200 ${isYearly ? 'text-slateCustom-900' : 'text-slateCustom-450'}`}>Yearly Billing</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wide uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto pt-6">
            {pricingTiers.map((tier, idx) => {
              const price = isYearly ? tier.priceYearly : tier.priceMonthly;
              const hasPeriod = tier.period && price !== 'Custom';
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                    tier.popular 
                      ? 'border-accent bg-gradient-to-b from-slateCustom-900 via-slateCustom-950 to-slateCustom-900 text-white shadow-[0_0_35px_rgba(6,182,212,0.15)] z-10 scale-[1.03] md:scale-[1.05]' 
                      : 'border-slateCustom-200 bg-white/80 backdrop-blur-sm text-slateCustom-900 shadow-md hover:shadow-xl hover:border-slateCustom-300'
                  }`}
                >
                  {/* Highlight Ribbon / Badge */}
                  {tier.popular ? (
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <span className="px-4.5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-gradient-to-r from-accent via-cyan-400 to-primary text-slateCustom-950 shadow-[0_4px_12px_rgba(6,182,212,0.3)] whitespace-nowrap">
                        {tier.badge}
                      </span>
                    </div>
                  ) : (
                    <span className="absolute top-4 right-6 text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded bg-slateCustom-100 text-slateCustom-600 border border-slateCustom-200/60">
                      {tier.badge}
                    </span>
                  )}

                  <div>
                    <h3 className={`text-xs font-black font-display uppercase tracking-widest mt-2 ${tier.popular ? 'text-accent font-black' : 'text-primary font-bold'}`}>
                      {tier.name}
                    </h3>
                    
                    <div className="flex items-baseline mt-6 mb-1">
                      <span className={`text-5xl font-black font-display tracking-tight ${tier.popular ? 'text-white' : 'text-slateCustom-900'}`}>
                        {price}
                      </span>
                      {hasPeriod && (
                        <span className={`text-xs ml-2 font-bold uppercase ${tier.popular ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>
                          /{tier.period}
                        </span>
                      )}
                    </div>
                    
                    {/* Billed Annually detail */}
                    {isYearly && price !== 'Custom' ? (
                      <p className={`text-[10px] font-bold mb-4 ${tier.popular ? 'text-cyan-400' : 'text-primary'}`}>
                        Billed annually (₹{price === '₹79' ? '948' : '1,908'}/yr)
                      </p>
                    ) : (
                      <div className="h-4 mb-4" />
                    )}

                    <p className={`text-xs leading-relaxed mt-2 mb-6 ${tier.popular ? 'text-slateCustom-300' : 'text-slateCustom-500'}`}>
                      {tier.description}
                    </p>

                    <ul className="space-y-4 border-t border-slateCustom-200/20 pt-6">
                      {tier.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start text-xs font-semibold">
                          <CheckCircle2 className={`h-4.5 w-4.5 mr-3 shrink-0 ${tier.popular ? 'text-accent' : 'text-primary'}`} />
                          <span className={tier.popular ? 'text-slateCustom-200' : 'text-slateCustom-700'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full mt-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                      tier.popular
                        ? 'bg-gradient-to-r from-accent via-cyan-500 to-primary text-slateCustom-950 font-black'
                        : 'bg-slateCustom-900 hover:bg-slateCustom-800 text-white border border-slateCustom-900'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-xs text-slateCustom-500 mt-12 italic">
            * Fits perfectly within local organizational budgets. All prices are displayed in Indian Rupees (INR) exclusively.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-100 border-t border-slateCustom-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slateCustom-900 tracking-tight">
                Need Help Getting Set Up?
              </h2>
              <p className="text-slateCustom-600">
                Contact our support desk. We can assist in integrating custom student email rosters, configuring MongoDB databases, or establishing role credentials.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-slateCustom-700 font-medium">+1 (800) 555-0199</span>
                </div>
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-slateCustom-700 font-medium">support@attendance.pro</span>
                </div>
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-slateCustom-700 font-medium">100 Tech Plaza, Palo Alto, CA</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slateCustom-200 shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); alert("Demo request sent! We will contact you soon."); }} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">First Name</label>
                  <input type="text" required className="px-4 py-2.5 rounded-lg border border-slateCustom-200 focus:outline-none focus:border-primary text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1 flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Last Name</label>
                  <input type="text" required className="px-4 py-2.5 rounded-lg border border-slateCustom-200 focus:outline-none focus:border-primary text-sm" />
                </div>
                <div className="col-span-2 flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Work Email</label>
                  <input type="email" required className="px-4 py-2.5 rounded-lg border border-slateCustom-200 focus:outline-none focus:border-primary text-sm" />
                </div>
                <div className="col-span-2 flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Institution Name</label>
                  <input type="text" required className="px-4 py-2.5 rounded-lg border border-slateCustom-200 focus:outline-none focus:border-primary text-sm" />
                </div>
                <div className="col-span-2 flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">How can we help?</label>
                  <textarea rows="4" required className="px-4 py-2.5 rounded-lg border border-slateCustom-200 focus:outline-none focus:border-primary text-sm resize-none"></textarea>
                </div>
                <div className="col-span-2 pt-2">
                  <button type="submit" className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-sm hover:shadow transition-all text-sm">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slateCustom-950 text-slateCustom-400 py-16 border-t border-slateCustom-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center text-white">
                <GraduationCap className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold font-display tracking-tight">Smart Attendance <span className="text-primary">Pro</span></span>
              </div>
              <p className="text-xs leading-relaxed text-slateCustom-500">
                Next-generation automated attendance systems leveraging react interfaces and secure cloud databases.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">Support</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Overview</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slateCustom-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slateCustom-500">
            <p>&copy; 2026 Smart Attendance Pro. All rights reserved.</p>
            <p>Designed and built for Modern Academies.</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal (Watch Demo) */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="absolute inset-0 bg-slateCustom-950/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-slateCustom-950 rounded-3xl overflow-hidden shadow-2xl border border-slateCustom-800 z-10"
            >
              {/* Header Bar */}
              <div className="px-6 py-4 bg-slateCustom-900 border-b border-slateCustom-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slateCustom-400 ml-2 font-mono uppercase tracking-wider">
                    Smart Attendance Pro — Live Demonstration
                  </span>
                </div>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="p-1 rounded-full text-slateCustom-400 hover:text-white hover:bg-slateCustom-800 transition-all focus:outline-none"
                  aria-label="Close demo modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Demo Video Embed */}
              <div className="aspect-video bg-black relative">
                <video
                  className="w-full h-full object-contain bg-black"
                  src="/demo.mp4"
                  controls
                  autoPlay
                  muted
                  playsInline
                ></video>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
