import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { calculateCareerMatches } from '../utils/scoringEngine';
import { CAREERS_DATA } from '../data/careersData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  User, Award, Milestone, Brain, BookOpen, Clock, Flame,
  Terminal, ShieldCheck, ChevronRight, Activity, Zap
} from 'lucide-react';

export default function Dashboard({ profile }) {
  const navigate = useNavigate();
  const matches = calculateCareerMatches(profile, CAREERS_DATA);
  const [roadmapProgress] = useLocalStorage('futurealign_roadmap', {});
  const [completedProjects] = useLocalStorage('futurealign_projects', {});
  const [quizAttempts] = useLocalStorage('futurealign_quiz', {});

  if (matches.length === 0) {
    return null; // App router will redirect to assessment, but guard just in case
  }

  const topMatch = matches[0];
  const careerId = topMatch.careerId;

  // 1. Calculate Skill Completion %
  const totalSkills = topMatch.requiredSkills.length;
  const completedSkills = topMatch.requiredSkills.filter(s => profile.skills?.[s] !== undefined).length;
  const skillCompletionPercentage = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  // 2. Calculate Roadmap Progress %
  let totalTopics = 0;
  let completedTopics = 0;
  ['beginner', 'intermediate', 'advanced'].forEach((stage) => {
    const topics = topMatch.roadmap[stage]?.topics || [];
    totalTopics += topics.length;
    topics.forEach((_, idx) => {
      const status = roadmapProgress[`${careerId}-${stage}-${idx}`] || 'NOT_STARTED';
      if (status === 'COMPLETED') completedTopics++;
    });
  });
  const roadmapProgressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // 3. Calculate Projects Completed Count
  const totalProjects = topMatch.projects.length;
  const completedProjectsCount = topMatch.projects.filter((_, idx) => completedProjects[`${careerId}-${idx}`]).length;

  // 4. Calculate Interview Score
  let totalQuestions = topMatch.interviewPrep.length;
  let understoodCount = 0;
  topMatch.interviewPrep.forEach((_, idx) => {
    if (quizAttempts[`${careerId}-${idx}`] === 'UNDERSTOOD') understoodCount++;
  });

  // 5. Determine next recommended action
  const missingSkills = topMatch.requiredSkills.filter(s => profile.skills?.[s] === undefined);
  let nextActionTitle = 'Start learning core concepts';
  let nextActionDesc = 'Go to your roadmap and begin the beginner phase.';
  let nextActionLink = '/roadmap';

  if (missingSkills.length > 0) {
    nextActionTitle = `Learn ${missingSkills[0]}`;
    nextActionDesc = `Close your skill gap for ${missingSkills[0]} under the Skill Gap section.`;
    nextActionLink = '/skill-gap';
  } else if (roadmapProgressPercentage < 100) {
    nextActionTitle = 'Track your learning timeline';
    nextActionDesc = 'Mark intermediate or advanced roadmap tasks as completed.';
    nextActionLink = '/roadmap';
  } else if (completedProjectsCount < totalProjects) {
    nextActionTitle = 'Build portfolio projects';
    nextActionDesc = `Construct the ${topMatch.projects[completedProjectsCount]?.title || 'next recommended project'}.`;
    nextActionLink = '/projects';
  } else if (understoodCount < totalQuestions) {
    nextActionTitle = 'Practice interview questions';
    nextActionDesc = 'Self-evaluate technical mock questions to prep for interviews.';
    nextActionLink = '/interview';
  } else {
    nextActionTitle = 'Ask AI coach for advanced advice';
    nextActionDesc = 'You are ready! Open a chat session to map out job applications.';
    nextActionLink = '/chat';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-950/70 border border-emerald-900 px-2.5 py-1 rounded-md">Student Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">Welcome back, {profile.name}!</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Track your dynamic preparation progress for a career in technology.</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0 relative z-10">
          <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-3 text-white">
            <User className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Degree & Stream</span>
              <span className="text-xs font-bold">{profile.degree} • {profile.branch}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Career Match Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Top Career Match</span>
            <span className="text-sm font-black text-slate-800 block truncate max-w-[150px]">{topMatch.name}</span>
            <span className="text-xs font-bold text-emerald-700 block">{topMatch.matchPercentage}% Match</span>
          </div>
        </div>

        {/* Skill Completion Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl shrink-0">
            <Brain className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Skill Completion</span>
            <span className="text-sm font-black text-slate-850 block">{skillCompletionPercentage}% Complete</span>
            <span className="text-xs text-slate-500 block">{completedSkills} of {totalSkills} skills</span>
          </div>
        </div>

        {/* Roadmap Progress Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl shrink-0">
            <Milestone className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Roadmap Progress</span>
            <span className="text-sm font-black text-slate-850 block">{roadmapProgressPercentage}% Complete</span>
            <span className="text-xs text-slate-500 block">{completedTopics} of {totalTopics} topics</span>
          </div>
        </div>

        {/* Portfolio & Prep Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl shrink-0">
            <Terminal className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Projects & Prep</span>
            <span className="text-sm font-black text-slate-850 block">{completedProjectsCount} Projects Built</span>
            <span className="text-xs text-slate-500 block">{understoodCount} / {totalQuestions} Prep Score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Action & Score Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Recommendation Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider">
                <Zap className="h-4 w-4 fill-emerald-100 animate-pulse" />
                <span>Recommended Next Step</span>
              </div>
              <h3 className="text-lg font-black text-slate-850">{nextActionTitle}</h3>
              <p className="text-xs text-slate-550 max-w-md">{nextActionDesc}</p>
            </div>
            <Link
              to={nextActionLink}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-lg shadow transition-colors flex items-center space-x-1 whitespace-nowrap"
            >
              <span>Take Action</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Critical Skill Gaps Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-4">Critical Skill Gaps</h3>
            {missingSkills.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">You are missing these required technologies to align with a **{topMatch.name}** profile:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {missingSkills.map((s) => (
                    <span key={s} className="bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-100 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
                <div className="pt-2 text-right">
                  <Link to="/skill-gap" className="text-xs font-bold text-emerald-650 hover:underline">Open Skill Gap Analysis →</Link>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-2 text-slate-700 text-xs leading-relaxed font-semibold">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>You possess all core required skills for your recommended career profile! Start building your projects list to construct your portfolio.</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Navigation Quick Links */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
          <h3 className="font-bold text-slate-800 text-base mb-2">Preparation Checklist</h3>
          
          <Link
            to="/results"
            className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700">Career Results</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            to="/roadmap"
            className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Milestone className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-bold text-slate-700">Learning Roadmap</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            to="/projects"
            className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Terminal className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-bold text-slate-700">Coding Projects</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            to="/interview"
            className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-bold text-slate-700">Interview Practice</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            to="/chat"
            className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-pink-600" />
              <span className="text-xs font-bold text-slate-700">AI Chat Coach</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
