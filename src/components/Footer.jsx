import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors">
              <GraduationCap className="h-7 w-7" />
              <span className="font-bold text-lg tracking-tight text-white">
                Future<span className="text-emerald-400">Align</span>
              </span>
            </Link>
            <p className="text-sm max-w-sm">
              An intelligent, scoring-engine driven platform designed to guide students towards their ideal career path through skills analysis, roadmaps, and personal AI guidance.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Application</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/assessment" className="hover:text-white transition-colors">Assessment</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-white transition-colors">AI Career Coach</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Developed For</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-400">
                Academic Project Demonstration
              </li>
              <li className="text-xs text-slate-500">
                Built with React, Express, and Tailwind CSS.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} FutureAlign. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for final college review</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
