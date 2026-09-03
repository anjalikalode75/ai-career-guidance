import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { calculateCareerMatches } from '../utils/scoringEngine';
import { CAREERS_DATA } from '../data/careersData';
import { Award, ArrowRight, Brain, Milestone, Terminal, MessageSquare, Flame, CheckCircle, Clock, ShieldAlert, Loader2, Sparkles, HelpCircle } from 'lucide-react';

export default function CareerResults({ profile }) {
  const navigate = useNavigate();
  const matches = calculateCareerMatches(profile, CAREERS_DATA);

  const [enrichment, setEnrichment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fallbackWarning, setFallbackWarning] = useState(false);

  useEffect(() => {
    const fetchEnrichment = async () => {
      if (!profile) return;
      setLoading(true);
      try {
        const response = await fetch('/api/recommend/enrich', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profile }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setEnrichment(data);
            setFallbackWarning(!!data.fallback);
          } else {
            throw new Error(data.error);
          }
        } else {
          throw new Error('Failed to load enrichment');
        }
      } catch (err) {
        console.warn('Failed to load AI career enrichment:', err);
        setFallbackWarning(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrichment();
  }, [profile]);

  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 max-w-md mx-auto">
          <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Profile Found</h2>
          <p className="text-sm text-slate-600 mb-6">Please complete the career assessment form first to view your compatibility results.</p>
          <Link
            to="/assessment"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  const topMatch = matches[0];
  const otherMatches = matches.slice(1, 4); // Show top 3 alternative matches

  const breakdownFields = [
    { key: 'skills', label: 'Skills Alignment', color: 'bg-emerald-500' },
    { key: 'interests', label: 'Interests Correlation', color: 'bg-blue-500' },
    { key: 'strengths', label: 'Strengths Fit', color: 'bg-purple-500' },
    { key: 'education', label: 'Education Relevance', color: 'bg-amber-500' },
    { key: 'goals', label: 'Goal/Preference Match', color: 'bg-pink-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Calculating compatibility and querying AI Coach advice...</p>
        </div>
      </div>
    );
  }

  const displayAdvice = enrichment?.advice || topMatch.whySuitabilityExplanation;
  const displayStrategy = enrichment?.strategy || `Prioritize learning missing technologies: ${topMatch.requiredSkills.filter(s => (profile.skills?.[s] === undefined)).join(', ')}. Focus on building projects like ${topMatch.projects?.[0]?.title || 'hands-on apps'} to solidify these.`;
  const displayComparison = enrichment?.comparison || `A career as a ${topMatch.name} offers strong growth. Compared to other paths, it aligns directly with your strengths in ${profile.strengths?.join(', ') || 'problem solving'}.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Career Guidance Profile</h1>
        <p className="text-slate-500 mt-1">Based on the calculations of our scoring engine matching your input traits.</p>
      </div>

      {fallbackWarning && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-center space-x-3 mb-6 shadow-sm shrink-0">
          <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="text-xs text-slate-600">
            Running in <strong>Local Fallback Mode</strong> due to missing or delayed API keys on the server. Career breakdown recommendations are computed locally.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Top Match Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Recommendation Hero Card */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Top Match Badge */}
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-bl-xl shadow-sm flex items-center space-x-1">
              <Award className="h-3.5 w-3.5" />
              <span>Top Match</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">Primary Recommendation</span>
                <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{topMatch.name}</h2>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center bg-emerald-50">
                  <span className="font-extrabold text-emerald-700 text-xl">{topMatch.matchPercentage}%</span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-sm">{topMatch.description}</p>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-4 border-y border-slate-100 my-6 py-4">
              <div className="text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Difficulty</span>
                <div className="flex items-center justify-center space-x-1 mt-1 text-slate-700 font-semibold text-xs">
                  <Flame className="h-3.5 w-3.5 text-amber-500 fill-current" />
                  <span>{topMatch.difficulty}</span>
                </div>
              </div>
              <div className="text-center border-x border-slate-100">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Est. Learning</span>
                <div className="flex items-center justify-center space-x-1 mt-1 text-slate-700 font-semibold text-xs">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>{topMatch.estLearningTime}</span>
                </div>
              </div>
              <div className="text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Match Confidence</span>
                <div className="flex items-center justify-center space-x-1 mt-1 text-emerald-700 font-bold text-xs">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* AI Advisor Breakdown Sections */}
            <div className="space-y-4 mb-6">
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-5">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Award className="h-4 w-4" />
                  <span>Why This Path Fits</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{displayAdvice}</p>
              </div>

              <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-5">
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Milestone className="h-4 w-4" />
                  <span>AI Learning Strategy</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{displayStrategy}</p>
              </div>

              <div className="bg-purple-50/50 border border-purple-100/50 rounded-xl p-5">
                <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Brain className="h-4 w-4" />
                  <span>AI Domain Comparison</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{displayComparison}</p>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              <button
                onClick={() => navigate('/roadmap')}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm text-center"
              >
                <Milestone className="h-5 w-5 text-emerald-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700">View Roadmap</span>
              </button>
              <button
                onClick={() => navigate('/skill-gap')}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm text-center"
              >
                <Brain className="h-5 w-5 text-blue-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700">Skill Gap</span>
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm text-center"
              >
                <Terminal className="h-5 w-5 text-purple-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700">Get Projects</span>
              </button>
              <button
                onClick={() => navigate('/interview')}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm text-center"
              >
                <Award className="h-5 w-5 text-amber-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700">Interview Prep</span>
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm text-center col-span-2 sm:col-span-1"
              >
                <MessageSquare className="h-5 w-5 text-pink-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700">AI Chat Coach</span>
              </button>
            </div>
          </div>

          {/* Sub-Metrics Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-6">Compatibility Breakdown</h3>
            <div className="space-y-4">
              {breakdownFields.map((field) => {
                const percentage = topMatch.breakdown[field.key] || 0;
                return (
                  <div key={field.key} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>{field.label}</span>
                      <span className="font-bold">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${field.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Other Recommendations */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Other Suitable Careers</h3>
            <p className="text-xs text-slate-500 mb-6">Other career paths matching your profiles and skills score breakdown.</p>
            
            <div className="space-y-4">
              {otherMatches.map((match) => (
                <div
                  key={match.careerId}
                  className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:bg-slate-50/50 transition-all flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">{match.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block">{match.difficulty} • {match.estLearningTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {match.matchPercentage}%
                    </span>
                    <button
                      onClick={() => {
                        // For a simple demonstration, navigate to the assessment or settings to switch goal
                      }}
                      className="text-slate-400 hover:text-slate-655 transition-colors p-1"
                      title="Explore in detail"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-400 mb-2">Next Step Recommendation</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              We recommend checking your **Skill Gap Analysis** to see exactly which software tools or programming languages you need to learn to secure a job as a **{topMatch.name}**.
            </p>
            <button
              onClick={() => navigate('/skill-gap')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1 shadow"
            >
              <span>Analyze Gaps</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
