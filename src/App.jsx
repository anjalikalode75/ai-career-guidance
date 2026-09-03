import React, { useState, useEffect } from 'react';
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

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Sync profile from Firestore when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setProfileLoading(true);
        try {
          const data = await getUserProfile(user.uid);
          setProfile(data);
          // If profile has a name like 'Demo Student', set demo mode true
          if (data?.name === 'Demo Student') {
            setIsDemoMode(true);
          } else {
            setIsDemoMode(false);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfile(null);
        setIsDemoMode(false);
        setProfileLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const updateProfileData = async (newProfile) => {
    if (!user) return;
    setProfileLoading(true);
    try {
      await saveUserProfile(user.uid, newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setProfileLoading(false);
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
    setProfileLoading(true);
    try {
      await clearUserProfile(user.uid);
      setProfile(null);
      setIsDemoMode(false);
      window.localStorage.removeItem('futurealign_roadmap');
      window.localStorage.removeItem('futurealign_interview_score');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const hasProfile = !!profile;
  const isSyncing = authLoading || profileLoading;

  if (isSyncing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Synchronizing database profile...</p>
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
                  {hasProfile ? <Dashboard profile={profile} /> : <Navigate to="/assessment" replace />}
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
                  {hasProfile ? <CareerResults profile={profile} /> : <Navigate to="/assessment" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  {hasProfile ? <RoadmapPage profile={profile} /> : <Navigate to="/assessment" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/skill-gap"
              element={
                <ProtectedRoute>
                  {hasProfile ? <SkillGapPage profile={profile} /> : <Navigate to="/assessment" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  {hasProfile ? <ProjectsPage profile={profile} /> : <Navigate to="/assessment" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  {hasProfile ? <InterviewPrep profile={profile} /> : <Navigate to="/assessment" replace />}
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
                  {hasProfile ? (
                    <SettingsPage clearProfile={clearProfile} />
                  ) : (
                    <Navigate to="/assessment" replace />
                  )
                }
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
