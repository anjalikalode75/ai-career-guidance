import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await resetPassword(email);
      setSuccessMsg('Reset password link has been sent to your email. Please check your inbox.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Forgot Password</h2>
          <p className="text-xs text-slate-500 mt-1.5">Enter your email and we'll send you a password reset link</p>
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
                placeholder="you@college.edu"
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
                <span>Sending link...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
