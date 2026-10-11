import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Users,
  Award,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DataIntegrityBadge } from '../common/DataIntegrityBadge';

export const Module8Analytics: React.FC = () => {
  const { books, borrowRecords, quizzes, pointHistory, setActiveTab } = useLibrary();

  // Metrics computation
  const totalTitles = books.length;
  const activeTitles = books.filter(b => b.isActive).length;
  const totalPhysicalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalAvailableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);

  const activeBorrows = borrowRecords.filter(r => r.status === 'ACTIVE').length;
  const overdueBorrows = borrowRecords.filter(r => r.status === 'OVERDUE').length;
  const returnedBorrows = borrowRecords.filter(r => r.status === 'RETURNED').length;
  const totalCirculationTx = borrowRecords.length;

  const overdueRate = totalCirculationTx > 0 ? Math.round((overdueBorrows / totalCirculationTx) * 100) : 0;

  // Points computation
  const pointsIssued = pointHistory
    .filter(t => t.type === 'EARNED')
    .reduce((acc, t) => acc + t.amount, 0);

  const pointsRedeemed = pointHistory
    .filter(t => t.type === 'REDEEMED')
    .reduce((acc, t) => acc + t.amount, 0);

  // Discipline breakdown
  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach(b => {
      map.set(b.category, (map.get(b.category) || 0) + b.totalCopies);
    });
    return Array.from(map.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: totalPhysicalCopies > 0 ? Math.round((count / totalPhysicalCopies) * 100) : 0
    }));
  }, [books, totalPhysicalCopies]);

  // Overdue records
  const overdueList = borrowRecords.filter(r => r.status === 'OVERDUE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 8</span>
            <span className="text-slate-300">·</span>
            <DataIntegrityBadge type="verified" label="Live Circulation & Inventory Telemetry" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Admin Analytics & Circulation Intelligence</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional overview of active loans, collection health, overdue liabilities, and learning rewards
          </p>
        </div>

        <button
          onClick={() => setActiveTab('java-hub')}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <span>View Spring Boot Analytics Code</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Books */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Collection Size</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalPhysicalCopies} Copies</div>
          <div className="text-xs text-slate-500">
            Across <strong>{totalTitles}</strong> distinct titles ({totalAvailableCopies} currently on shelves)
          </div>
        </div>

        {/* Card 2: Active Borrows */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Borrows</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{activeBorrows} Books</div>
          <div className="text-xs text-slate-500">
            <strong>{returnedBorrows}</strong> completed returns logged this term
          </div>
        </div>

        {/* Card 3: Overdue Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{overdueBorrows} Items ({overdueRate}%)</div>
          <div className="text-xs text-slate-500">
            ₹{overdueBorrows * 30} accrued fine liability at ₹5/day
          </div>
        </div>

        {/* Card 4: Learning Points Economy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Rewards Economy</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pointsIssued} Pts Issued</div>
          <div className="text-xs text-slate-500">
            <strong>{pointsRedeemed} Pts</strong> redeemed for library study perks
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Category Distribution */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Catalogue Discipline Breakdown</h3>
                <p className="text-xs text-slate-500">Distribution of physical copies across university faculties</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700">{totalPhysicalCopies} Total Copies</span>
          </div>

          <div className="space-y-4">
            {categoryStats.map(item => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.category}</span>
                  <span className="text-slate-500">
                    <strong>{item.count}</strong> copies ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
            All categories conform to the Dewey Decimal / Library of Congress Classification (LCC) system and correspond to active degree curricula at Alliance University.
          </div>
        </div>

        {/* Right Column: Overdue Risk & Compliance Monitor */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Overdue Risk Monitor</h3>
                  <p className="text-xs text-slate-500">Circulation items exceeding 14-day borrowing threshold</p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {overdueList.length} Delinquent
              </span>
            </div>

            <div className="pt-3 space-y-3">
              {overdueList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  No overdue circulation records. Full compliance achieved.
                </div>
              ) : (
                overdueList.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.bookTitle}</h4>
                      <span className="font-bold text-rose-700 text-[11px] whitespace-nowrap">
                        Fine: ₹{item.fineAmount}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Patron: <strong>{item.userName}</strong> ({item.userEmail})
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-rose-200/50">
                      <span>Barcode: {item.copyBarcode}</span>
                      <span>Due: {item.dueDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => alert(`Official reminder batch dispatched to ${overdueList.length} delinquent patron email addresses.`)}
              disabled={overdueList.length === 0}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Dispatch Automated Overdue Notices (Email Batch)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
