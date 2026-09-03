import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ArrowLeft, ArrowRight, Check, Award, BookOpen, Brain, Sparkles, Heart, Briefcase, Target, ShieldAlert } from 'lucide-react';

const SKILLS_LIST = [
  'Python', 'Java', 'JavaScript', 'C++', 'SQL', 'HTML/CSS',
  'React', 'Node.js', 'Git', 'Docker', 'AWS', 'Figma'
];

const INTERESTS_LIST = [
  'Web Development', 'Mobile App Development', 'Data Analytics',
  'Machine Learning & AI', 'Cloud Computing & DevOps',
  'Cybersecurity', 'UI/UX Design'
];

const STRENGTHS_LIST = [
  'Analytical Thinking', 'Problem Solving', 'Creativity',
  'Communication', 'Leadership', 'Teamwork', 'Attention to Detail'
];

const WEAKNESSES_LIST = [
  'Public Speaking', 'Time Management', 'Delegating Tasks',
  'Impatience', 'Overthinking', 'Asking for Help'
];

const INITIAL_FORM = {
  name: '',
  year: '3rd Year',
  semester: '5th Semester',
  degree: 'B.Tech',
  branch: 'Computer Science',
  skills: {}, // e.g. { Python: 3, SQL: 4 }
  interests: [],
  strengths: [],
  weaknesses: [],
  workType: 'Remote',
  experience: 'Beginner',
  goal: 'Software Developer'
};

export default function CareerAssessment({ profile, setProfile, isDemoMode }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useLocalStorage('futurealign_assessment_draft', INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // Sync with profile if demo mode is activated or a profile exists
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => {
      const skills = { ...prev.skills };
      if (skills[skill] !== undefined) {
        delete skills[skill];
      } else {
        skills[skill] = 3; // Default rating is Intermediate (3)
      }
      return { ...prev, skills };
    });
  };

  const handleSkillRatingChange = (skill, rating) => {
    setFormData((prev) => {
      const skills = { ...prev.skills };
      skills[skill] = rating;
      return { ...prev, skills };
    });
  };

  const handleMultiSelectToggle = (field, item) => {
    setFormData((prev) => {
      const items = [...prev[field]];
      const index = items.indexOf(item);
      if (index > -1) {
        items.splice(index, 1);
      } else {
        items.push(item);
      }
      return { ...prev, [field]: items };
    });
  };

  const validateStep = (step) => {
    const nextErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) {
        nextErrors.name = 'Full Name is required';
      }
    }
    if (step === 2) {
      if (!formData.degree) {
        nextErrors.degree = 'Degree is required';
      }
      if (!formData.branch) {
        nextErrors.branch = 'Branch/Stream is required';
      }
    }
    if (step === 3) {
      if (Object.keys(formData.skills).length === 0) {
        nextErrors.skills = 'Please select at least one skill to progress';
      }
    }
    if (step === 4) {
      if (formData.interests.length === 0) {
        nextErrors.interests = 'Please select at least one interest';
      }
    }
    if (step === 5) {
      if (formData.strengths.length === 0) {
        nextErrors.strengths = 'Please select at least one strength';
      }
      if (formData.weaknesses.length === 0) {
        nextErrors.weaknesses = 'Please select at least one weakness';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setProfile(formData);
      navigate('/results');
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear the form?')) {
      setFormData(INITIAL_FORM);
      setCurrentStep(1);
      setErrors({});
    }
  };

  // Step Icons mapping
  const stepMeta = [
    { num: 1, name: 'Personal', icon: BookOpen },
    { num: 2, name: 'Education', icon: Award },
    { num: 3, name: 'Skills', icon: Brain },
    { num: 4, name: 'Interests', icon: Sparkles },
    { num: 5, name: 'Traits', icon: Heart },
    { num: 6, name: 'Preferences', icon: Briefcase },
    { num: 7, name: 'Goals', icon: Target }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      {/* Step Indicator Header */}
      <div className="mb-10">
        <div className="flex justify-between items-center relative">
          {/* Connector Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-600 -z-10 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (stepMeta.length - 1)) * 100}%` }}
          />

          {stepMeta.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <div key={step.num} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    // Allow navigating backwards or forwards if valid
                    if (step.num < currentStep) {
                      setCurrentStep(step.num);
                    } else if (step.num > currentStep) {
                      // Validate intermediate steps
                      let canNavigate = true;
                      for (let i = currentStep; i < step.num; i++) {
                        if (!validateStep(i)) {
                          canNavigate = false;
                          break;
                        }
                      }
                      if (canNavigate) setCurrentStep(step.num);
                    }
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-50'
                      : isCompleted
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-700'
                      : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5 stroke-[2.5]" /> : <Icon className="h-5 w-5" />}
                </button>
                <span
                  className={`text-[10px] sm:text-xs font-semibold mt-2 hidden sm:inline-block ${
                    isActive ? 'text-emerald-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner Alert for Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-rose-50 border-b border-rose-100 px-6 py-4 flex items-center space-x-3 text-rose-800 text-sm">
            <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{Object.values(errors)[0]}</span>
          </div>
        )}

        <div className="p-6 sm:p-10 min-h-[350px]">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Tell us about yourself</h2>
                <p className="text-sm text-slate-500 mt-1">Provide your name and academic standing to customize the experience.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="year" className="block text-sm font-semibold text-slate-700 mb-1.5">Current Academic Year</label>
                    <select
                      id="year"
                      value={formData.year}
                      onChange={(e) => updateField('year', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Graduated</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="semester" className="block text-sm font-semibold text-slate-700 mb-1.5">Current Semester</label>
                    <select
                      id="semester"
                      value={formData.semester}
                      onChange={(e) => updateField('semester', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white"
                    >
                      <option>1st Semester</option>
                      <option>2nd Semester</option>
                      <option>3rd Semester</option>
                      <option>4th Semester</option>
                      <option>5th Semester</option>
                      <option>6th Semester</option>
                      <option>7th Semester</option>
                      <option>8th Semester</option>
                      <option>N/A</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Academic Background</h2>
                <p className="text-sm text-slate-500 mt-1">Specify your current degree plan and major field of study.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="degree" className="block text-sm font-semibold text-slate-700 mb-1.5">Degree / Diploma</label>
                  <select
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => updateField('degree', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white"
                  >
                    <option>B.Tech</option>
                    <option>B.E.</option>
                    <option>BCA</option>
                    <option>B.Sc</option>
                    <option>M.Tech</option>
                    <option>MCA</option>
                    <option>M.Sc</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-semibold text-slate-700 mb-1.5">Branch / Stream / Major</label>
                  <select
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => updateField('branch', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-white"
                  >
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>Electronics & Communication</option>
                    <option>Electrical Engineering</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                    <option>Data Science</option>
                    <option>AI/ML</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Technical Skills */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Your Technical Skills</h2>
                <p className="text-sm text-slate-500 mt-1">Select the languages and tools you know, and rate your proficiency from 1 (Beginner) to 5 (Expert).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILLS_LIST.map((skill) => {
                  const hasSkill = formData.skills[skill] !== undefined;
                  const rating = formData.skills[skill] || 3;

                  return (
                    <div
                      key={skill}
                      className={`border rounded-xl p-4 transition-all ${
                        hasSkill ? 'border-emerald-500 bg-emerald-50/20 shadow-sm' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className="flex items-center space-x-2 text-sm font-bold text-slate-700 select-none text-left"
                        >
                          <div
                            className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                              hasSkill ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {hasSkill && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span>{skill}</span>
                        </button>
                      </div>

                      {hasSkill && (
                        <div className="mt-4 pt-2 border-t border-slate-200/60">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Proficiency:</span>
                            <span className="font-bold text-emerald-700">
                              {['Novice', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][rating - 1]} ({rating}/5)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => handleSkillRatingChange(skill, parseInt(e.target.value))}
                            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">What fields interest you?</h2>
                <p className="text-sm text-slate-500 mt-1">Select the disciplines or categories you are curious to explore or work in.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTERESTS_LIST.map((interest) => {
                  const selected = formData.interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => handleMultiSelectToggle('interests', interest)}
                      className={`text-left p-4 border rounded-xl font-semibold text-sm transition-all flex items-center justify-between ${
                        selected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{interest}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          selected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Strengths & Weaknesses */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Identify Strengths & Weaknesses</h2>
                  <p className="text-sm text-slate-500 mt-1">Selecting these traits helps the scoring engine align soft-skills compatibility.</p>
                </div>

                <div className="space-y-2">
                  <span className="block text-sm font-semibold text-slate-700">My Key Strengths (Soft Skills/Aptitudes)</span>
                  <div className="flex flex-wrap gap-2">
                    {STRENGTHS_LIST.map((strength) => {
                      const selected = formData.strengths.includes(strength);
                      return (
                        <button
                          type="button"
                          key={strength}
                          onClick={() => handleMultiSelectToggle('strengths', strength)}
                          className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                            selected
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {strength}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <span className="block text-sm font-semibold text-slate-700">Areas I Want to Improve (Weaknesses)</span>
                <div className="flex flex-wrap gap-2">
                  {WEAKNESSES_LIST.map((weakness) => {
                    const selected = formData.weaknesses.includes(weakness);
                    return (
                      <button
                        type="button"
                        key={weakness}
                        onClick={() => handleMultiSelectToggle('weaknesses', weakness)}
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                          selected
                            ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {weakness}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Career Preferences */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Work Preferences</h2>
                <p className="text-sm text-slate-500 mt-1">Specify your target environment and current general level of experience.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Work Setting</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Remote', 'Hybrid', 'Onsite'].map((type) => {
                      const selected = formData.workType === type;
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => updateField('workType', type)}
                          className={`py-3.5 border rounded-xl text-center text-sm font-semibold transition-all ${
                            selected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Overall Experience Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                      const selected = formData.experience === level;
                      return (
                        <button
                          type="button"
                          key={level}
                          onClick={() => updateField('experience', level)}
                          className={`py-3.5 border rounded-xl text-center text-sm font-semibold transition-all ${
                            selected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Goals */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Future Aspirations & Target Goal</h2>
                <p className="text-sm text-slate-500 mt-1">What is your primary career target? (e.g. software engineer, data scientist, startup founder, designer).</p>
              </div>

              <div>
                <label htmlFor="goal" className="block text-sm font-semibold text-slate-700 mb-2">Target Career Role / Goal Description</label>
                <textarea
                  id="goal"
                  rows="4"
                  value={formData.goal}
                  onChange={(e) => updateField('goal', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Build backend infrastructure as a Cloud/DevOps Engineer in a product-based tech startup."
                  required
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3 text-slate-700">
                <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-emerald-800">Form complete!</span> Clicking submit will compute compatibility ratings across 10 career paths, create custom roadmaps, identify skill gaps, and setup the AI Chat Coach using our dynamic local scoring engine.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-semibold text-sm px-4 py-2 border border-slate-300 rounded-lg bg-white shadow-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-2 py-2"
              >
                Clear Form
              </button>
            )}
          </div>

          <div className="flex items-center">
            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                <span>Next Step</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-md transition-all hover:scale-[1.01]"
              >
                <span>Calculate Match</span>
                <Check className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
