import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { saveUserProfile } from '../services/dbService';
import { ShieldCheck, Loader2, RefreshCw } from 'lucide-react';

const SKILLS_LIST = [
  'Python', 'Java', 'JavaScript', 'C++', 'SQL', 'HTML/CSS',
  'React', 'Node.js', 'Git', 'Docker', 'AWS', 'Figma'
];

const INTERESTS_LIST = [
  'Web Development', 'Mobile App Development', 'Data Analytics',
  'Machine Learning & AI', 'Cloud Computing & DevOps',
  'Cybersecurity', 'UI/UX Design'
];

export default function SettingsPage({ clearProfile, profile, updateProfileData }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    degree: profile?.degree || 'B.Tech',
    branch: profile?.branch || 'Computer Science',
    year: profile?.year || '3rd Year',
    semester: profile?.semester || '5th Semester',
    skills: profile?.skills || {},
    interests: profile?.interests || [],
    strengths: profile?.strengths || [],
    weaknesses: profile?.weaknesses || [],
    workType: profile?.workType || 'Remote',
    experience: profile?.experience || 'Beginner',
    goal: profile?.goal || ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTextChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    setSuccess(false);
  };

  const handleSkillToggle = (skill) => {
    setSuccess(false);
    setFormData((prev) => {
      const skills = { ...prev.skills };
      if (skills[skill] !== undefined) {
        delete skills[skill];
      } else {
        skills[skill] = 3; // default rating
      }
      return { ...prev, skills };
    });
  };

  const handleSkillRatingChange = (skill, rating) => {
    setSuccess(false);
    setFormData((prev) => {
      const skills = { ...prev.skills };
      skills[skill] = rating;
      return { ...prev, skills };
    });
  };

  const handleInterestToggle = (interest) => {
    setSuccess(false);
    setFormData((prev) => {
      const interests = [...prev.interests];
      const idx = interests.indexOf(interest);
      if (idx > -1) {
        interests.splice(idx, 1);
      } else {
        interests.push(interest);
      }
      return { ...prev, interests };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name.trim() || !formData.goal.trim()) {
      setErrorMsg('Full name and career goal description are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      // Save changes to Firestore
      await saveUserProfile(user.uid, formData);
      
      // Update app profile state to synchronize results calculated dynamically
      if (updateProfileData) {
        await updateProfileData(formData);
      }
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Edit Student Profile</h1>
        <p className="text-slate-500 text-xs mb-6">Modify your academic degree, update skills proficiency, and target career goals. This recalculates compatibility dynamically.</p>

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs px-4 py-3 rounded-lg flex items-center space-x-2.5 mb-6">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="font-bold">Profile updated successfully.</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs px-4 py-3 rounded-lg flex items-center space-x-2.5 mb-6">
            <span className="font-bold">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleTextChange('name', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="goal" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Career Goal Description</label>
              <input
                type="text"
                id="goal"
                value={formData.goal}
                onChange={(e) => handleTextChange('goal', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                placeholder="e.g. AI Engineer, Full-Stack Developer"
              />
            </div>
          </div>

          {/* Section 2: Education Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
            <div>
              <label htmlFor="degree" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Degree</label>
              <select
                id="degree"
                value={formData.degree}
                onChange={(e) => handleTextChange('degree', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
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
              <label htmlFor="branch" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Branch</label>
              <select
                id="branch"
                value={formData.branch}
                onChange={(e) => handleTextChange('branch', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Electronics & Communication</option>
                <option>Data Science</option>
                <option>AI/ML</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Academic Year</label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) => handleTextChange('year', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Graduated</option>
              </select>
            </div>
          </div>

          {/* Section 3: Skills List & Proficiency */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <span className="block text-xs font-bold text-slate-700 uppercase">Core Skills Proficiencies</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SKILLS_LIST.map((skill) => {
                const hasSkill = formData.skills[skill] !== undefined;
                const rating = formData.skills[skill] || 3;
                return (
                  <div key={skill} className="border border-slate-100 rounded-xl p-3 flex flex-col justify-center">
                    <button
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className="flex items-center space-x-2 text-sm font-semibold text-slate-700 select-none text-left"
                    >
                      <input
                        type="checkbox"
                        checked={hasSkill}
                        onChange={() => {}} // toggled on button click
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                      />
                      <span>{skill}</span>
                    </button>
                    {hasSkill && (
                      <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Level: {rating}/5</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={rating}
                          onChange={(e) => handleSkillRatingChange(skill, parseInt(e.target.value))}
                          className="w-1/2 accent-emerald-600 cursor-pointer h-1 bg-slate-200 rounded"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Interests Checkboxes */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <span className="block text-xs font-bold text-slate-700 uppercase">Subject Interests</span>
            <div className="flex flex-wrap gap-2">
              {INTERESTS_LIST.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Profile Changes...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Account Deletion / Reset Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="font-bold text-rose-600 text-base mb-1.5">Reset Profile Data</h3>
        <p className="text-xs text-slate-500 mb-6">Resetting your profile deletes all your records in Firestore, clearing your calculated career match and checklist parameters. This cannot be undone.</p>
        <button
          onClick={clearProfile}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          Reset Profile Details
        </button>
      </div>
    </div>
  );
}
