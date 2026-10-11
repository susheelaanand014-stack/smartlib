import React from 'react';
import { BookOpen, ShieldCheck, ExternalLink, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { DataIntegrityBadge } from './DataIntegrityBadge';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      {/* Top Banner with Data Integrity Notice */}
      <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2">
            <DataIntegrityBadge type="verified" label="Academic Catalogue Architecture" />
            <span className="text-slate-500">|</span>
            <span>Official Institutional Integration:</span>
            <a
              href="https://library.alliance.edu.in/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              https://library.alliance.edu.in/
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="text-slate-400 text-center md:text-right">
            Demonstration data & sandbox accounts are clearly segregated from live university production records.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base font-serif">SmartLib UniHub</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Unified University Library Management System integrating intelligent syllabus discovery, physical shelf navigation, automated deadline notifications, and gamified academic learning quests.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                System Status: All 8 Modules Operational
              </span>
            </div>
          </div>

          {/* Col 2: Library Hours */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Operating Hours
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex justify-between">
                <span>Mon – Fri (Circulation):</span>
                <span className="text-slate-200 font-medium">08:00 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-slate-200 font-medium">09:00 AM – 06:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday (Reading Room):</span>
                <span className="text-slate-200 font-medium">10:00 AM – 05:00 PM</span>
              </li>
              <li className="flex justify-between text-blue-300">
                <span>Mid-Term Exam Period:</span>
                <span className="font-semibold">24/7 Badge Access</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Circulation Policies */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Circulation Rules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Undergrad Loan Limit: <strong className="text-slate-200">3 Books (14 Days)</strong></li>
              <li>• Postgrad / Faculty Limit: <strong className="text-slate-200">5 Books (30 Days)</strong></li>
              <li>• Overdue Fine: <strong className="text-rose-400">₹5 / Day / Item</strong></li>
              <li>• Maximum Renewals: <strong className="text-slate-200">2 Consecutive Terms</strong></li>
              <li>• Reference & Theses: In-Library Consultation Only</li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Central Campus Desk
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Central University Library Building, North Campus, Chikkahagade Cross, Anekal Main Road, Bengaluru 562106
            </p>
            <div className="pt-1 space-y-1 text-slate-400">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300">library@alliance.edu.in</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300">+91 (80) 4619 9000 (Ext. 240)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Tech Stack */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            &copy; 2026 SmartLib University Library System. Designed for Alliance University Academic Hub.
          </div>
          <div className="flex items-center gap-3">
            <span>Spring Boot 3.3.4</span>
            <span className="text-slate-700">·</span>
            <span>MySQL 8.0 `smartlib_db`</span>
            <span className="text-slate-700">·</span>
            <span>Apache PDFBox 3.0</span>
            <span className="text-slate-700">·</span>
            <span>Spring Security 6.3</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
