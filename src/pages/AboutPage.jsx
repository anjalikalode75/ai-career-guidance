import React from 'react';
import { ArrowDown, GraduationCap, LayoutDashboard, BrainCircuit, Activity, BarChart2, BookOpen, MessageSquare, Terminal } from 'lucide-react';

export default function AboutPage() {
  const steps = [
    { title: "Student Profile", icon: GraduationCap, desc: "Captures education, stream, skills, interests, strengths, weaknesses, and goals." },
    { title: "Career Assessment", icon: BookOpen, desc: "7-step comprehensive multi-choice and selection wizard saved to local browser cache." },
    { title: "Career Scoring Engine", icon: BrainCircuit, desc: "Evaluates compatibility scoring dynamically across profiles using standard formula weighting." },
    { title: "Skill Gap Analysis", icon: BarChart2, desc: "Compares current skill competencies directly with required profiles using gap indicators." },
    { title: "Personalized Roadmap", icon: Activity, desc: "Creates dynamic 3, 6, and 12-month beginner/intermediate/advanced curriculums." },
    { title: "Projects & Interview Preparation", icon: Terminal, desc: "Calculates mock project requirements and generates customized interview prep questions." },
    { title: "AI Career Coach", icon: MessageSquare, desc: "Offers real-time Q&A dialogue sessions aware of calculated metrics and preferences." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 text-center">About FutureAlign</h1>
        <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
          FutureAlign is designed for college evaluations, demonstrating a scoring-engine backed career compatibility calculator integrated with mock/live AI coaching modules.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Platform Architecture Flow</h2>

        <div className="space-y-4 max-w-lg mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={idx}>
                <div className="flex items-start space-x-4 border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{step.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown className="h-5 w-5 text-slate-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
