import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  BookOpen,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Search,
  MapPin,
  FileText,
  Trophy,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Coins
} from 'lucide-react';
import { DataIntegrityBadge } from '../common/DataIntegrityBadge';

export const Module1Home: React.FC = () => {
  const {
    currentUser,
    borrowRecords,
    books,
    returnBook,
    renewBook,
    setActiveTab,
    setSelectedBookForShelf
  } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Active loans for current patron
  const activeLoans = borrowRecords.filter(
    r => (currentUser.role === 'ADMIN' ? true : r.userId === currentUser.id) &&
         (r.status === 'ACTIVE' || r.status === 'OVERDUE')
  );

  // Due soon items (within 48 hours relative to Oct 11, 2026)
  const dueSoonCount = activeLoans.filter(r => {
    const today = new Date('2026-10-11').getTime();
    const due = new Date(r.dueDate).getTime();
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  }).length;

  const totalFines = activeLoans.reduce((sum, r) => sum + (r.fineAmount || 0), 0);

  const handleReturn = (id: string) => {
    const res = returnBook(id);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleRenew = (id: string) => {
    const res = renewBook(id);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('catalogue');
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Welcome Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Alliance University Central Library</span>
            <span>·</span>
            <span className="font-mono">{currentUser.studentOrEmpId}</span>
            <span>·</span>
            <DataIntegrityBadge type="policy" label="Academic Session 2026-27" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser.department} · {currentUser.role === 'ADMIN' ? 'Chief Librarian Administration' : 'Undergraduate Patron'}
          </p>
        </div>

        {/* Quick Search Bar */}
        <form onSubmit={handleSearch} className="w-full sm:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search books, ISBN, authors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>
        </form>
      </div>

      {feedback && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Essential KPI Metrics (Compact & Clean) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Active Loans */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Current Loans</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {activeLoans.length} <span className="text-xs font-normal text-slate-500">/ {currentUser.maxBorrowLimit} limit</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {currentUser.maxBorrowLimit - activeLoans.length} borrowing slots available
          </div>
        </div>

        {/* Metric 2: Due Soon */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Due in &le; 48 Hours</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {dueSoonCount} <span className="text-xs font-normal text-slate-500">items</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {dueSoonCount > 0 ? 'Urgent renewal recommended' : 'No imminent deadlines'}
          </div>
        </div>

        {/* Metric 3: Fines Balance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Outstanding Fines</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            ₹{totalFines.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            {totalFines === 0 ? 'Patron account in good standing' : 'Pay at counter or renew item'}
          </div>
        </div>

        {/* Metric 4: Learning Rewards */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Quest Rewards</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600">
            {currentUser.points} <span className="text-xs font-normal text-slate-600">Points</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Redeem for quiet study carrels & extension passes
          </div>
        </div>
      </div>

      {/* Main 2-Column Minimal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Current Loans & Due Dates */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Current Borrowings & Due Dates</h2>
              <p className="text-xs text-slate-500">Physical books on loan from Central Library stacks</p>
            </div>
            <button
              onClick={() => setActiveTab('borrowing')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              View Full History &rarr;
            </button>
          </div>

          {activeLoans.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
              <p>No active loans on your patron account.</p>
              <button
                onClick={() => setActiveTab('catalogue')}
                className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeLoans.map(loan => {
                const book = books.find(b => b.id === loan.bookId);
                const today = new Date('2026-10-11').getTime();
                const due = new Date(loan.dueDate).getTime();
                const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
                const isOverdue = diffDays < 0;
                const isUrgent = diffDays >= 0 && diffDays <= 2;

                return (
                  <div key={loan.id} className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={loan.bookCoverUrl}
                        alt={loan.bookTitle}
                        className="w-12 h-16 object-cover rounded-md border border-slate-200 flex-shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Barcode: {loan.copyBarcode}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">
                          {loan.bookTitle}
                        </h3>
                        <p className="text-[11px] text-slate-600">
                          {loan.bookAuthor}
                        </p>
                        {book && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-0.5">
                            <MapPin className="w-3 h-3 text-blue-600" />
                            <span>Floor {book.shelf.floor} · {book.shelf.bay}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isOverdue
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : isUrgent
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isOverdue ? `Overdue (-₹${Math.abs(diffDays) * 5})` : isUrgent ? `Due in ${diffDays} day(s)` : `Due: ${loan.dueDate}`}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleRenew(loan.id)}
                          disabled={isOverdue || loan.renewedCount >= loan.maxRenewals}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40"
                          title="Renew loan (+7 days)"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => handleReturn(loan.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Return
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions & Circulation Hours */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Essential Library Actions
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => setActiveTab('catalogue')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 text-slate-800 font-semibold text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Search Book Catalogue</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('shelf')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 text-slate-800 font-semibold text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>Interactive 2D Shelf Finder</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('syllabus')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 text-slate-800 font-semibold text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Upload Syllabus PDF</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('quests')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 text-slate-800 font-semibold text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Library Quest & Rewards</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Operating Hours & Institutional Portal Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Library Schedule & Access
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex justify-between">
                <span>Circulation Desk:</span>
                <span className="font-semibold text-white">08:00 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Floor 2 Study Pods:</span>
                <span className="font-semibold text-emerald-400">24/7 Badge Access</span>
              </li>
              <li className="flex justify-between">
                <span>Weekend Hours:</span>
                <span className="font-semibold text-slate-200">09:00 AM – 06:00 PM</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800">
              <a
                href="https://library.alliance.edu.in/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Official Alliance Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="block text-[10px] text-slate-400 text-center mt-1.5">
                For official institutional thesis and proxy authentication
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
