import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculateCareerMatches } from '../utils/scoringEngine';
import { CAREERS_DATA } from '../data/careersData';
import { useAuth } from '../hooks/useAuth';
import { getUserProgress, saveUserProgress } from '../services/dbService';
import { ShieldAlert, BookOpen, AlertCircle, Eye, EyeOff, Lightbulb, ChevronRight, HelpCircle, Award, Loader2 } from 'lucide-react';

export default function InterviewPrep({ profile }) {
  const { user } = useAuth();
  const matches = calculateCareerMatches(profile, CAREERS_DATA);
  const [selectedCareerId, setSelectedCareerId] = useState(matches[0]?.careerId || '');
  
  // Track quiz metrics in Firestore: { "careerId-questionIndex": "UNDERSTOOD" | "NEEDS_REVIEW" }
  const [quizAttempts, setQuizAttempts] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync and load history on mount / user change
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const progress = await getUserProgress(user.uid);
        setQuizAttempts(progress.interview || {});
      } catch (err) {
        console.error('Error loading interview progress:', err);
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
          <p className="text-xs font-semibold text-slate-500">Loading interview metrics...</p>
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
          <p className="text-sm text-slate-600 mb-6">Complete the assessment first to practice interview preparation questions.</p>
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
  const questions = selectedCareer.interviewPrep || [];

  const handleCareerChange = (e) => {
    setSelectedCareerId(e.target.value);
    setCurrentIdx(0);
    setShowHint(false);
    setShowAnswer(false);
  };

  const handleNext = () => {
    setShowHint(false);
    setShowAnswer(false);
    setCurrentIdx(prev => (prev + 1) % questions.length);
  };

  const recordResponse = async (status) => {
    if (!user) return;
    const key = `${selectedCareerId}-${currentIdx}`;
    const updatedAttempts = {
      ...quizAttempts,
      [key]: status
    };

    setQuizAttempts(updatedAttempts);

    try {
      await saveUserProgress(user.uid, 'interview', updatedAttempts);
    } catch (err) {
      console.error(err);
    }
    handleNext();
  };

  // Calculate scores
  const getCareerStats = () => {
    let attempted = 0;
    let understood = 0;
    questions.forEach((_, idx) => {
      const response = quizAttempts[`${selectedCareerId}-${idx}`];
      if (response) {
        attempted++;
        if (response === 'UNDERSTOOD') understood++;
      }
    });
    return { attempted, understood };
  };

  const { attempted, understood } = getCareerStats();
  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Interview Preparation</h1>
          <p className="text-slate-500 mt-1">Review specialized technical and behavioral questions.</p>
        </div>
        <div className="shrink-0 flex items-center space-x-2 bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 pl-2">Select Path:</span>
          <select
            value={selectedCareerId}
            onChange={handleCareerChange}
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

      {/* Stats Summary Widget */}
      <div className="grid grid-cols-3 gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-8">
        <div className="text-center">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Total Prep Questions</span>
          <span className="text-lg font-extrabold text-slate-800 mt-1 block">{questions.length}</span>
        </div>
        <div className="text-center border-x border-slate-100">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Attempted</span>
          <span className="text-lg font-extrabold text-slate-850 mt-1 block">{attempted}</span>
        </div>
        <div className="text-center">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Understood / Score</span>
          <span className="text-lg font-bold text-emerald-700 mt-1 block">{understood}</span>
        </div>
      </div>

      {/* Main Flashcard Interface */}
      {currentQuestion ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header tags */}
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-100">
                  {currentQuestion.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {currentQuestion.topic}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>

            {/* Content area */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-start space-x-2 text-slate-800">
                  <HelpCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <h3 className="text-base sm:text-lg font-bold leading-snug">{currentQuestion.question}</h3>
                </div>
              </div>

              {/* Hint Section */}
              {showHint && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-start space-x-2.5 text-xs text-amber-900 leading-relaxed font-medium">
                  <Lightbulb className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Conceptual Tip:</span> Try to define the core principles first and construct clean real-world analogies.
                  </div>
                </div>
              )}

              {/* Answer Guidance Section */}
              {showAnswer && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Answer Guidance</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{currentQuestion.answerGuidance}</p>
                </div>
              )}
            </div>

            {/* Footer Navigation within Card */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    showHint ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-white text-slate-650 border-slate-250 hover:bg-slate-50'
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{showHint ? 'Hide Tip' : 'Show Tip'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    showAnswer ? 'bg-slate-200 text-slate-800 border-slate-350' : 'bg-white text-slate-650 border-slate-250 hover:bg-slate-50'
                  }`}
                >
                  {showAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{showAnswer ? 'Hide Answer' : 'Show Answer'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <span>Skip</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Self Evaluation Banner after showing answer */}
          {showAnswer && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-700 font-semibold text-center sm:text-left">Did you understand this topic and answer explanation?</span>
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => recordResponse('NEEDS_REVIEW')}
                  className="bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Needs Review
                </button>
                <button
                  onClick={() => recordResponse('UNDERSTOOD')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  I Understand
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center bg-white border rounded-2xl p-10 shadow-sm">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-600 text-sm">No preparation questions available for this career path.</h3>
        </div>
      )}
    </div>
  );
}
