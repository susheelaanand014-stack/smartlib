import React, { useState, useEffect } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book } from '../../types/library';
import {
  MapPin,
  Compass,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Search,
  Navigation,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DataIntegrityBadge } from '../common/DataIntegrityBadge';

export const Module6ShelfFinder: React.FC = () => {
  const {
    books,
    borrowRecords,
    currentUser,
    selectedBookForShelf,
    setSelectedBookForShelf,
    renewBook,
    returnBook,
    setActiveTab
  } = useLibrary();

  const [activeFloor, setActiveFloor] = useState<number>(2);
  const [selectedBay, setSelectedBay] = useState<string>('Bay B-04');
  const [searchBookTerm, setSearchBookTerm] = useState<string>('');
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // If a book was selected in another module, synchronize floor and bay
  useEffect(() => {
    if (selectedBookForShelf) {
      setActiveFloor(selectedBookForShelf.shelf.floor);
      setSelectedBay(selectedBookForShelf.shelf.bay);
    }
  }, [selectedBookForShelf]);

  // List of active shelf bays for Floor 1 & Floor 2
  const floor1Bays = [
    { id: 'Bay W-02', wing: 'West Wing', label: 'Management & Marketing', x: 22, y: 35, count: 2 },
    { id: 'Bay W-05', wing: 'West Wing', label: 'Finance & Accounts', x: 22, y: 65, count: 1 },
    { id: 'Bay S-01', wing: 'South Wing', label: 'Constitutional Law', x: 70, y: 75, count: 1 },
    { id: 'Bay N-04', wing: 'North Wing', label: 'Mechanical Engineering', x: 70, y: 35, count: 1 }
  ];

  const floor2Bays = [
    { id: 'Bay B-01', wing: 'North Wing', label: 'Software Craftsmanship', x: 22, y: 25, count: 1 },
    { id: 'Bay B-02', wing: 'North Wing', label: 'Systems & Compilers', x: 22, y: 50, count: 1 },
    { id: 'Bay B-04', wing: 'North Wing', label: 'Algorithms & Structures', x: 22, y: 75, count: 2 },
    { id: 'Bay B-06', wing: 'North Wing', label: 'Operating Systems', x: 45, y: 35, count: 1 },
    { id: 'Bay B-08', wing: 'North Wing', label: 'Database Systems', x: 45, y: 65, count: 1 },
    { id: 'Bay E-03', wing: 'East Wing', label: 'Intelligent Systems & AI', x: 75, y: 30, count: 1 },
    { id: 'Bay E-05', wing: 'East Wing', label: 'Deep Neural Networks', x: 75, y: 55, count: 1 },
    { id: 'Bay E-08', wing: 'East Wing', label: 'Data Science & Machine Learning', x: 75, y: 80, count: 1 }
  ];

  const currentFloorBays = activeFloor === 1 ? floor1Bays : floor2Bays;

  // Find books on current selected bay
  const booksOnSelectedBay = books.filter(
    b => b.shelf.floor === activeFloor && b.shelf.bay === selectedBay
  );

  // Active loans for deadline countdown
  const userLoans = borrowRecords.filter(
    r => (currentUser.role === 'ADMIN' ? true : r.userId === currentUser.id) &&
         (r.status === 'ACTIVE' || r.status === 'OVERDUE')
  );

  const getLoanTimeInfo = (dueDate: string) => {
    const today = new Date('2026-10-11').getTime();
    const due = new Date(dueDate).getTime();
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      const overdue = Math.abs(diff);
      return {
        isOverdue: true,
        days: overdue,
        fine: overdue * 5,
        text: `Overdue by ${overdue} day${overdue > 1 ? 's' : ''}! Please return immediately.`
      };
    } else if (diff === 0) {
      return {
        isOverdue: false,
        days: 0,
        fine: 0,
        text: 'Due today by 10:00 PM circulation closing.'
      };
    } else {
      return {
        isOverdue: false,
        days: diff,
        fine: 0,
        text: `${diff} day${diff > 1 ? 's' : ''} left until deadline.`
      };
    }
  };

  const handleSendReminder = (record: any) => {
    setReminderToast(`Duplicate-safe in-app reminder scheduled for "${record.bookTitle}". Alert sent to ${record.userEmail}.`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 6</span>
            <span className="text-slate-300">·</span>
            <DataIntegrityBadge type="policy" label="Floor Mapping & Duplicate-Safe Notifications" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Shelf Finder & Deadline Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive floorplan stack locator, personal loan countdowns, and official renewal portal integration
          </p>
        </div>

        {/* Floor Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setActiveFloor(1);
              setSelectedBay('Bay W-02');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeFloor === 1 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Floor 1 (Management & Law)</span>
          </button>
          <button
            onClick={() => {
              setActiveFloor(2);
              setSelectedBay('Bay B-04');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeFloor === 2 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Floor 2 (Tech, AI & Sciences)</span>
          </button>
        </div>
      </div>

      {reminderToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Main Grid: Interactive Map (Left) & Bay Details + Deadlines (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 2D Floor Map */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Central Library — Floor {activeFloor} Interactive Blueprint
                </h3>
                <p className="text-[11px] text-slate-500">
                  Click any book stack or aisle below to view localized titles & walking directions
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Selected: {selectedBay}
            </span>
          </div>

          {/* Interactive SVG/HTML Map Canvas */}
          <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 select-none shadow-inner">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40"></div>

            {/* Entrance & Reference Desk */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-900/60 border border-blue-500/50 rounded-lg px-4 py-1.5 text-center text-white text-[10px] font-bold z-10 shadow-md">
              <span className="text-blue-300 font-semibold block">▲ ENTRANCE & HELP DESK</span>
              <span>Floor {activeFloor} Reception</span>
            </div>

            {/* Quiet Study Lounge Zone */}
            <div className="absolute top-3 left-4 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1 text-slate-300 text-[10px] font-medium">
              Silent Study Pods & LAN Carrels
            </div>

            {/* Digital Commons Zone */}
            <div className="absolute top-3 right-4 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1 text-slate-300 text-[10px] font-medium">
              Digital Commons & E-Theses Terminals
            </div>

            {/* Render Clickable Book Stack Bays */}
            {currentFloorBays.map(bay => {
              const isSelected = selectedBay === bay.id;
              const hasMatchingSelectedBook =
                selectedBookForShelf &&
                selectedBookForShelf.shelf.floor === activeFloor &&
                selectedBookForShelf.shelf.bay === bay.id;

              return (
                <div
                  key={bay.id}
                  onClick={() => setSelectedBay(bay.id)}
                  style={{ left: `${bay.x}%`, top: `${bay.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 p-2.5 rounded-xl border text-center ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-300 ring-4 ring-blue-500/30 scale-105 z-20 shadow-lg'
                      : hasMatchingSelectedBook
                      ? 'bg-amber-600 text-white border-amber-300 ring-4 ring-amber-500/40 animate-pulse z-20'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-700 z-10'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                    <span className="font-mono text-[11px] font-bold">{bay.id}</span>
                  </div>
                  <div className="text-[10px] opacity-90 line-clamp-1 max-w-[110px] mt-0.5">
                    {bay.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Walking Directions Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
            <Navigation className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">
                Turn-by-Turn Wayfinding to {selectedBay}:
              </span>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                {booksOnSelectedBay[0]?.shelf.walkingDirections ||
                  `From Floor ${activeFloor} entrance, take the central aisle past the Digital Commons. Proceed directly to ${selectedBay}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Books in Selected Bay & Deadline Notifications */}
        <div className="lg:col-span-5 space-y-6">
          {/* Bay Contents Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Books at {selectedBay} ({booksOnSelectedBay.length})
              </h3>
              <span className="text-[11px] text-slate-500">Floor {activeFloor}</span>
            </div>

            {booksOnSelectedBay.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No indexed catalogue books assigned to this bay coordinate.
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {booksOnSelectedBay.map(b => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 flex items-start gap-3 transition-colors"
                  >
                    <img
                      src={b.coverUrl}
                      alt={b.title}
                      className="w-10 h-14 object-cover rounded shadow-xs border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{b.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{b.author}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>Shelf Lvl {b.shelf.shelfLevel}</span>
                        <span className={b.availableCopies > 0 ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>
                          {b.availableCopies} Copies Available
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Loan Deadline Tracker */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Active Loan Deadlines ({userLoans.length})
                </h3>
              </div>
              <DataIntegrityBadge type="policy" label="₹5/day Overdue Policy" />
            </div>

            {userLoans.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No active loans pending return. Borrow a book to view countdown timers.
              </p>
            ) : (
              <div className="space-y-3">
                {userLoans.map(loan => {
                  const info = getLoanTimeInfo(loan.dueDate);
                  return (
                    <div
                      key={loan.id}
                      className={`p-3.5 rounded-xl border space-y-2 ${
                        info.isOverdue
                          ? 'bg-rose-50/60 border-rose-200'
                          : info.days <= 2
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{loan.bookTitle}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">Copy: {loan.copyBarcode}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            info.isOverdue
                              ? 'bg-rose-600 text-white'
                              : info.days <= 2
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {info.isOverdue ? `Overdue (-₹${info.fine})` : `Due: ${loan.dueDate}`}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-tight">
                        {info.text}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <button
                          onClick={() => handleSendReminder(loan)}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Send In-App Reminder
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const res = renewBook(loan.id);
                              alert(res.message);
                            }}
                            disabled={info.isOverdue || loan.renewedCount >= loan.maxRenewals}
                            className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-40"
                          >
                            Renew (+7d)
                          </button>
                          <button
                            onClick={() => {
                              const res = returnBook(loan.id);
                              alert(res.message);
                            }}
                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
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

            {/* Official University Portal Renewal CTA */}
            <div className="pt-2 border-t border-slate-100">
              <a
                href="https://library.alliance.edu.in/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Official Alliance Library Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="block text-[10px] text-slate-400 text-center mt-1.5">
                Official institutional renewals and inter-library requests
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
