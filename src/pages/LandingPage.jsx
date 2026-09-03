import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BrainCircuit, Activity, BarChart2, BookOpen, MessageSquare, Terminal } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: "Scoring Engine",
      desc: "Matches your profile against detailed professional profiles using a multi-factor weighting algorithm.",
      icon: BrainCircuit,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Skill Gap Analysis",
      desc: "Compares your existing skills to the required profile and highlights exactly where you need to improve.",
      icon: BarChart2,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Dynamic Roadmaps",
      desc: "Receive customized 3, 6, and 12-month roadmaps that adjust as you complete items.",
      icon: Activity,
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Projects & Interview Prep",
      desc: "Get relevant project ideas and practice simulated technical and behavioral questions.",
      icon: Terminal,
      color: "text-amber-600 bg-amber-50"
    }
  ];

  const steps = [
    { num: "01", name: "Career Assessment", desc: "Share details on your education, skills, interests, and strengths." },
    { num: "02", name: "Weighted Match", desc: "The scoring engine computes dynamic suitability percentages." },
    { num: "03", name: "Personalized Insights", desc: "Get structural roadmaps, gap metrics, and project concepts." },
    { num: "04", name: "AI Career Coaching", desc: "Discuss recommendations and next steps with the chatbot." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-24 sm:pb-36 bg-gradient-to-b from-emerald-50/50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-100/75 text-emerald-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-6">
            <GraduationCap className="h-4.5 w-4.5" />
            <span>AI-Driven Career Guidance Platform</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-none">
            Navigate Your Career Path with <span className="text-emerald-600">Calculated Clarity</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
            Take a comprehensive assessment, analyze skill gaps with direct scoring metrics, build specialized roadmaps, and chat with an interactive AI Career Coach.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/assessment"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-base"
            >
              <span>Start Career Assessment</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/chat"
              className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold px-8 py-4 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 text-base"
            >
              <MessageSquare className="h-5 w-5 text-slate-500" />
              <span>Try AI Chatbot</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Everything You Need To Plan Your Future</h2>
            <p className="mt-4 text-slate-600">A genuinely functional set of tools designed to guide you step-by-step from raw skills to a complete career preparation routine.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white flex flex-col items-start">
                  <div className={`p-3 rounded-lg mb-4 ${feat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How FutureAlign Works</h2>
            <p className="mt-4 text-slate-600">The clear operational flow our recommendation system uses to calculate guidance metrics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 relative shadow-sm">
                <div className="text-4xl font-extrabold text-emerald-100 absolute top-4 right-4 leading-none select-none">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-2 mb-2">{step.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Categories Call to Action */}
      <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to Find Your Career Profile?</h2>
          <p className="mt-4 text-emerald-200 max-w-lg mx-auto text-base">
            Assess suitability for software developers, cloud engineers, UI/UX designers, data scientists, AI/ML engineers, and more.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/assessment"
              className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-3.5 rounded-md font-bold transition-colors shadow-sm flex items-center space-x-2"
            >
              <span>Get Matched Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
