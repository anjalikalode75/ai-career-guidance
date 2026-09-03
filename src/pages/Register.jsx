import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your typing.');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name.trim());
      setSuccessMsg('Account created successfully! Preparing dashboard...');
      setTimeout(() => {
        navigate('/assessment');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register account.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-500 mt-1.5">Sign up to match your skills with matching career roadmaps</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs px-4 py-3 rounded-lg flex items-start space-x-2.5 mb-6">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs px-4 py-3 rounded-lg flex items-start space-x-2.5 mb-6">
            <span className="font-bold">✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                placeholder="john@college.edu"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                placeholder="Min 6 characters"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-655"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                placeholder="Retype password"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-sm shadow transition-all flex items-center justify-center space-x-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Registering account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
