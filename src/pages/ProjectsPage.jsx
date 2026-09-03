import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculateCareerMatches } from '../utils/scoringEngine';
import { CAREERS_DATA } from '../data/careersData';
import { useAuth } from '../hooks/useAuth';
import { getUserProgress, saveUserProgress } from '../services/dbService';
import { ShieldAlert, Terminal, Award, Layers, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

export default function ProjectsPage({ profile }) {
  const { user } = useAuth();
  const matches = calculateCareerMatches(profile, CAREERS_DATA);
  const [selectedCareerId, setSelectedCareerId] = useState(matches[0]?.careerId || '');
  const [completedProjects, setCompletedProjects] = useState({});
  const [loading, setLoading] = useState(true);

  // Sync and load history on mount / user change
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const progress = await getUserProgress(user.uid);
        setCompletedProjects(progress.projects || {});
      } catch (err) {
        console.error('Error loading projects progress:', err);
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
          <p className="text-xs font-semibold text-slate-500">Loading career projects...</p>
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
          <p className="text-sm text-slate-600 mb-6">Complete the assessment first to view custom project recommendations.</p>
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
  const projects = selectedCareer.projects || [];

  const toggleProject = async (index) => {
    if (!user) return;
    const key = `${selectedCareerId}-${index}`;
    const updatedProjects = {
      ...completedProjects,
      [key]: !completedProjects[key]
    };

    setCompletedProjects(updatedProjects);

    try {
      await saveUserProgress(user.uid, 'projects', updatedProjects);
    } catch (err) {
      console.error(err);
    }
  };

  const getCompletedCount = () => {
    return projects.reduce((acc, _, idx) => {
      return acc + (completedProjects[`${selectedCareerId}-${idx}`] ? 1 : 0);
    }, 0);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Recommended Projects</h1>
          <p className="text-slate-500 mt-1">Hands-on applications designed to fill your skill gaps and build your resume.</p>
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

      {/* Completion Stat */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-700 text-sm">Portfolio Progress</h3>
          <p className="text-xs text-slate-500">Build these projects to demonstrate your competencies to recruiters.</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-center shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Completed</span>
          <span className="text-xl font-black text-slate-800">{getCompletedCount()} / {projects.length}</span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, idx) => {
          const isDone = !!completedProjects[`${selectedCareerId}-${idx}`];
          return (
            <div
              key={idx}
              className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                isDone ? 'border-emerald-500 ring-2 ring-emerald-50' : 'border-slate-200'
              }`}
            >
              {/* Checkmark Ribbon if Completed */}
              {isDone && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl shadow-sm flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Done</span>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-800 text-lg mb-2">{project.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{project.description}</p>

                {/* Tech Badges */}
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Technologies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Skills Acquired</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skillsGained.map((s, sIdx) => (
                        <span key={sIdx} className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Deliverable outcome */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Deliverable Outcome</span>
                  <span className="text-[11px] text-slate-700 font-semibold">{project.outcome}</span>
                </div>
                
                <button
                  onClick={() => toggleProject(idx)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all shrink-0 text-center ${
                    isDone
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                  }`}
                >
                  {isDone ? 'Mark Incomplete' : 'Mark Completed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
