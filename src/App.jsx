import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CareerAssessment from './pages/CareerAssessment';
import CareerResults from './pages/CareerResults';
import Dashboard from './pages/Dashboard';
import RoadmapPage from './pages/RoadmapPage';
import SkillGapPage from './pages/SkillGapPage';
import ProjectsPage from './pages/ProjectsPage';
import InterviewPrep from './pages/InterviewPrep';
import ChatbotPage from './pages/ChatbotPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { getUserProfile, saveUserProfile, clearUserProfile } from './services/dbService';
import { Loader2 } from 'lucide-react';

// Lightweight in-page loader for secondary pages
function PageLoader({ title = 'Loading...' }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">{title}</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const lastFetchedUidRef = useRef(null);

  // Progressive profile synchronization
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // Prevent duplicate fetches for same user session
      if (lastFetchedUidRef.current !== user.uid) {
        lastFetchedUidRef.current = user.uid;

        // 1. Instant cache load from localStorage (0ms transition)
        try {
          const cached = localStorage.getItem(`futurealign_profile_${user.uid}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            setProfile(parsed);
            setIsDemoMode(parsed?.name === 'Demo Student');
            setProfileLoading(false);
          } else {
            setProfileLoading(true);
          }
        } catch (e) {
          setProfileLoading(true);
        }

        // 2. Background fresh sync from Firestore
        getUserProfile(user.uid)
          .then((fresh) => {
            if (fresh) {
              setProfile(fresh);
              setIsDemoMode(fresh?.name === 'Demo Student');
            }
          })
          .catch((err) => {
            console.warn('Background profile fetch notice:', err.message);
          })
          .finally(() => {
            setProfileLoading(false);
          });
      }
    } else {
      // Clean up on logout
      lastFetchedUidRef.current = null;
      setProfile(null);
      setIsDemoMode(false);
      setProfileLoading(false);
    }
  }, [user, authLoading]);

  const updateProfileData = async (newProfile) => {
    if (!user) return;
    setProfile(newProfile); // optimistic update
    try {
      await saveUserProfile(user.uid, newProfile);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(error.message);
    }
  };

  const toggleDemoMode = async () => {
    if (!user) return;
    if (!isDemoMode) {
      const demoProfile = {
        name: 'Demo Student',
        degree: 'B.Tech',
        branch: 'Computer Science',
        year: '3rd Year',
        semester: '5th Semester',
        skills: {
          'Java': 3,
          'Python': 2,
          'SQL': 2,
          'HTML/CSS': 4
        },
        interests: ['Programming', 'Data', 'AI'],
        strengths: ['Analytical Thinking', 'Problem Solving'],
        weaknesses: ['Public Speaking'],
        workType: 'Remote',
        experience: 'Beginner',
        goal: 'AI/ML Engineering'
      };
      await updateProfileData(demoProfile);
      setIsDemoMode(true);
    } else {
      await clearProfile();
    }
  };

  const clearProfile = async () => {
    if (!user) return;
    setProfile(null);
    setIsDemoMode(false);
    try {
      await clearUserProfile(user.uid);
      window.localStorage.removeItem('futurealign_roadmap');
      window.localStorage.removeItem('futurealign_interview_score');
    } catch (error) {
      console.error('Failed to clear profile:', error);
      alert(error.message);
    }
  };

  const hasProfile = !!profile;

  // ONLY show cold-start loader while verifying initial auth session credentials (< 100ms)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Loading FutureAlign...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar
          isDemoMode={isDemoMode}
          toggleDemoMode={toggleDemoMode}
          hasProfile={hasProfile}
        />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard profile={profile} loading={profileLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <CareerAssessment
                    profile={profile}
                    setProfile={updateProfileData}
                    isDemoMode={isDemoMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  {profileLoading ? (
                    <PageLoader title="Loading career recommendations..." />
                  ) : hasProfile ? (
                    <CareerResults profile={profile} />
                  ) : (
                    <Navigate to="/assessment" replace />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  {profileLoading ? (
                    <PageLoader title="Loading learning roadmap..." />
                  ) : hasProfile ? (
                    <RoadmapPage profile={profile} />
                  ) : (
                    <Navigate to="/assessment" replace />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/skill-gap"
              element={
                <ProtectedRoute>
                  {profileLoading ? (
                    <PageLoader title="Analyzing skill gaps..." />
                  ) : hasProfile ? (
                    <SkillGapPage profile={profile} />
                  ) : (
                    <Navigate to="/assessment" replace />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  {profileLoading ? (
                    <PageLoader title="Loading coding projects..." />
                  ) : hasProfile ? (
                    <ProjectsPage profile={profile} />
                  ) : (
                    <Navigate to="/assessment" replace />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  {profileLoading ? (
                    <PageLoader title="Loading interview questions..." />
                  ) : hasProfile ? (
                    <InterviewPrep profile={profile} />
                  ) : (
                    <Navigate to="/assessment" replace />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatbotPage profile={profile} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage clearProfile={clearProfile} />
                </ProtectedRoute>
              }
            />

            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
