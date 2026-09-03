import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateCareerMatches } from '../utils/scoringEngine';
import { CAREERS_DATA } from '../data/careersData';
import { ShieldAlert, Brain, CheckCircle, AlertTriangle, ArrowRight, ChevronRight } from 'lucide-react';

export default function SkillGapPage({ profile }) {
  const matches = calculateCareerMatches(profile, CAREERS_DATA);
  const [selectedCareerId, setSelectedCareerId] = useState(matches[0]?.careerId || '');

  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 max-w-md mx-auto">
          <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Profile Found</h2>
          <p className="text-sm text-slate-600 mb-6">Complete the assessment first to evaluate skill gaps against career paths.</p>
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
  const studentSkills = profile.skills || {};

  // Build list of skills to analyze (combining required and recommended)
  const analysisList = [
    ...selectedCareer.requiredSkills.map(skill => ({ skill, isRequired: true })),
    ...selectedCareer.recommendedSkills.map(skill => ({ skill, isRequired: false }))
  ];

  // Calculate gaps
  const skillGaps = analysisList.map(({ skill, isRequired }) => {
    const currentRating = studentSkills[skill] || 0; // 0 to 5
    const requiredRating = isRequired ? 4 : 3; // Required skills need 4/5, recommended need 3/5
    const gap = Math.max(0, requiredRating - currentRating);
    
    let priority = 'Completed';
    let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (gap === 1) {
      priority = 'Low';
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (gap === 2) {
      priority = 'Medium';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
    } else if (gap >= 3) {
      priority = 'High';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
    }

    return {
      name: skill,
      isRequired,
      current: currentRating,
      required: requiredRating,
      gap,
      priority,
      badgeColor
    };
  });

  // Calculate stats
  const totalSkills = skillGaps.length;
  const completedSkills = skillGaps.filter(g => g.gap === 0).length;
  const completionPercentage = Math.round((completedSkills / totalSkills) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Skill Gap Analysis</h1>
          <p className="text-slate-500 mt-1">Compare your current proficiencies against target industry standards.</p>
        </div>
        <div className="shrink-0 flex items-center space-x-2 bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 pl-2">Select Career:</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Gap Comparison Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header info */}
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Competencies</span>
              <span className="text-xs font-bold text-slate-600">
                Overall Alignment: <span className="text-emerald-700 font-extrabold">{completionPercentage}%</span>
              </span>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {skillGaps.map((gapItem) => (
                <div key={gapItem.name} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Skill Name & Type */}
                  <div className="sm:w-1/4">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                      <span>{gapItem.name}</span>
                      {gapItem.isRequired ? (
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                          Req
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded">
                          Rec
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Gap: {gapItem.gap > 0 ? `${gapItem.gap} level${gapItem.gap > 1 ? 's' : ''}` : 'None'}
                    </span>
                  </div>

                  {/* Level Bars */}
                  <div className="flex-grow space-y-2">
                    {/* Current Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Current Proficiency</span>
                        <span className="font-bold text-slate-600">{gapItem.current}/5</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(gapItem.current / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Required Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Required Level</span>
                        <span className="font-semibold text-slate-500">{gapItem.required}/5</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-300 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(gapItem.required / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="sm:w-28 flex sm:justify-end shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${gapItem.badgeColor}`}>
                      {gapItem.priority === 'Completed' ? 'Matched' : `${gapItem.priority} Priority`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Analysis Insights</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm">
                <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md mt-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-bold text-slate-800 text-xs">Completed Skills</span>
                  <span className="text-xs text-slate-500">You fully meet or exceed the requirements for {completedSkills} of the {totalSkills} skills checked.</span>
                </div>
              </div>

              {skillGaps.some(g => g.priority === 'High') && (
                <div className="flex items-start space-x-3 text-sm">
                  <div className="p-1.5 bg-rose-50 text-rose-700 rounded-md mt-0.5">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-rose-800 text-xs">Critical Gaps Detected</span>
                    <span className="text-xs text-slate-500">
                      Skills like **{skillGaps.filter(g => g.priority === 'High').map(g => g.name).join(', ')}** present significant gaps. Prioritize learning these next.
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3 text-sm">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded-md mt-0.5">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-bold text-slate-800 text-xs">Next Recommended Action</span>
                  <span className="text-xs text-slate-500">Go to your learning curriculum roadmap to locate dedicated study resources and practice links for these skills.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-300">Ready to Learn?</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Open the 3-6-12 Month dynamic Roadmap matching your selected **{selectedCareer.name}** path to start learning.
            </p>
            <Link
              to="/roadmap"
              className="w-full bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <span>Go to Roadmap</span>
              <ChevronRight className="h-3.5 w-3.5 text-emerald-950" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
