import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculateCareerMatches } from '../utils/scoringEngine';
import { CAREERS_DATA } from '../data/careersData';
import { useAuth } from '../hooks/useAuth';
import { getUserProgress, saveUserProgress } from '../services/dbService';
import { ShieldAlert, CheckCircle2, Circle, PlayCircle, Milestone, Calendar, BookOpen, Check, Loader2 } from 'lucide-react';

export default function RoadmapPage({ profile }) {
  const { user } = useAuth();
  const matches = calculateCareerMatches(profile, CAREERS_DATA);
  const [selectedCareerId, setSelectedCareerId] = useState(matches[0]?.careerId || '');
  
  // Progress state: { "careerId-stage-index": "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" }
  const [roadmapProgress, setRoadmapProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Sync and load history on mount / user change
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const progress = await getUserProgress(user.uid);
        setRoadmapProgress(progress.roadmap || {});
      } catch (err) {
        console.error('Error loading roadmap progress:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading custom curriculum...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 max-w-md mx-auto">
          <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Profile Found</h2>
          <p className="text-sm text-slate-600 mb-6">Complete the assessment form first to generate your custom roadmap.</p>
          <Link
            to="/assessment"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  const selectedCareer = CAREERS_DATA.find(c => c.id === selectedCareerId);
  const stages = ['beginner', 'intermediate', 'advanced'];
  
  // Calculate total topics across all stages to calculate progress
  let totalTopics = 0;
  let completedTopics = 0;
  
  stages.forEach(stage => {
    const topics = selectedCareer.roadmap[stage]?.topics || [];
    totalTopics += topics.length;
    topics.forEach((_, idx) => {
      const status = roadmapProgress[`${selectedCareerId}-${stage}-${idx}`] || 'NOT_STARTED';
      if (status === 'COMPLETED') completedTopics++;
    });
  });

  const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const cycleStatus = async (stage, idx) => {
    if (!user) return;
    const key = `${selectedCareerId}-${stage}-${idx}`;
    const currentStatus = roadmapProgress[key] || 'NOT_STARTED';
    let nextStatus = 'NOT_STARTED';
    
    if (currentStatus === 'NOT_STARTED') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    else nextStatus = 'NOT_STARTED';

    const updatedProgress = {
      ...roadmapProgress,
      [key]: nextStatus
    };

    setRoadmapProgress(updatedProgress);

    try {
      await saveUserProgress(user.uid, 'roadmap', updatedProgress);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'Completed',
          color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600'
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          color: 'bg-amber-100 border-amber-300 text-amber-800',
          icon: PlayCircle,
          iconColor: 'text-amber-600'
        };
      default:
        return {
          label: 'Not Started',
          color: 'bg-slate-100 border-slate-200 text-slate-600',
          icon: Circle,
          iconColor: 'text-slate-400'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Personalized Career Roadmap</h1>
          <p className="text-slate-500 mt-1">A progressive curriculum mapped specifically to your target roles.</p>
        </div>
        <div className="shrink-0 flex items-center space-x-2 bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 pl-2">Select Path:</span>
          <select
            value={selectedCareerId}
            onChange={(e) => setSelectedCareerId(e.target.value)}
            className="border-none focus:ring-0 text-sm font-bold text-slate-700 bg-white"
          >
            {matches.map((m) => (
              <option key={m.careerId} value={m.careerId}>
                {m.name} ({m.matchPercentage}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Bar Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 w-full md:w-2/3">
          <div className="flex justify-between text-sm font-bold text-slate-700">
            <span>Overall Roadmap Progress</span>
            <span className="text-emerald-700">{progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Click the status badges on learning topics below to cycle progress: Not Started → In Progress → Completed.</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">Topics Learned</span>
          <span className="text-2xl font-black text-slate-800">{completedTopics} / {totalTopics}</span>
        </div>
      </div>

      {/* Roadmap Stages Stack */}
      <div className="space-y-12">
        {stages.map((stageKey, stageIdx) => {
          const stage = selectedCareer.roadmap[stageKey];
          if (!stage) return null;

          const durationText = stageKey === 'beginner' ? 'Month 1-3' : stageKey === 'intermediate' ? 'Month 4-6' : 'Month 7-12';
          const stageTag = stageKey === 'beginner' ? 'Beginner Path' : stageKey === 'intermediate' ? 'Intermediate Path' : 'Advanced Path';

          return (
            <div key={stageKey} className="relative">
              {/* Connector timeline line between stages */}
              {stageIdx < 2 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-200 -z-10 hidden md:block" style={{ height: 'calc(100% + 48px)' }} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Time Indicator column */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="md:hidden">
                      <span className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                        {stageTag}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm mt-0.5">{durationText}</h3>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                      {stageTag}
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-lg mt-3">{durationText}</h3>
                    <p className="text-xs text-slate-400 mt-1">{stage.title}</p>
                  </div>
                </div>

                {/* Topics & Learning List column */}
                <div className="md:col-span-3 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
                    {/* Topics Sub-list */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Core Learning Topics</h4>
                      <div className="space-y-3">
                        {stage.topics.map((topic, topicIdx) => {
                          const status = roadmapProgress[`${selectedCareerId}-${stageKey}-${topicIdx}`] || 'NOT_STARTED';
                          const meta = getStatusMeta(status);
                          const StatusIcon = meta.icon;

                          return (
                            <div
                              key={topicIdx}
                              className="flex items-center justify-between border border-slate-100 rounded-xl p-3.5 hover:bg-slate-50/50 transition-colors"
                            >
                              <span className="text-sm font-semibold text-slate-700">{topic}</span>
                              <button
                                type="button"
                                onClick={() => cycleStatus(stageKey, topicIdx)}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold select-none transition-all ${meta.color}`}
                              >
                                <StatusIcon className={`h-3.5 w-3.5 ${meta.iconColor}`} />
                                <span>{meta.label}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Practice & Resources grids */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gained Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {stage.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Practice Goal</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{stage.practice}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-start space-x-2 text-xs text-slate-600">
                      <BookOpen className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700">Recommended Resources:</span>{' '}
                        <span>{stage.resources}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
