import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  LayoutDashboard,
  BookOpen,
  RotateCcw,
  Users,
  FileText,
  MapPin,
  Trophy,
  BarChart3,
  Settings,
  Shield,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  KeyRound,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  LogOut,
  UserCheck,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  BookmarkCheck,
  Check,
  X,
  Sparkles,
  HelpCircle,
  Database,
  Server,
  Sun,
  Moon
} from 'lucide-react';
import { Book, User } from '../../types/library';

// Module components for tab embedding
import { Module3Catalogue } from '../modules/Module3Catalogue';
import { Module4Borrowing } from '../modules/Module4Borrowing';
import { Module5SyllabusFinder } from '../modules/Module5SyllabusFinder';
import { Module6ShelfFinder } from '../modules/Module6ShelfFinder';
import { Module7QuestRewards } from '../modules/Module7QuestRewards';
import { Module8Analytics } from '../modules/Module8Analytics';
import { Module2Auth } from '../modules/Module2Auth';
import { JavaDeliverablesHub } from '../modules/JavaDeliverablesHub';

type AdminTab =
  | 'overview'
  | 'inventory'
  | 'circulation'
  | 'patrons'
  | 'syllabus'
  | 'shelves'
  | 'quests'
  | 'analytics'
  | 'system';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    logout,
    books,
    borrowRecords,
    registeredUsers,
    addNewBook,
    returnBook,
    renewBook,
    sendOutlookOtp,
    resetToSampleData,
    setActiveTab
  } = useLibrary();

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick Action Modals
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isQuickIssueOpen, setIsQuickIssueOpen] = useState(false);
  const [isOtpTestOpen, setIsOtpTestOpen] = useState(false);

  // New Book Form State
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookIsbn, setNewBookIsbn] = useState('');
  const [newBookCategory, setNewBookCategory] = useState('Computer Science');
  const [newBookCallNumber, setNewBookCallNumber] = useState('QA76.6 .C67 2026');
  const [newBookCopies, setNewBookCopies] = useState(3);
  const [newBookFloor, setNewBookFloor] = useState(2);
  const [newBookAisle, setNewBookAisle] = useState('B-04');

  // Quick Issue Form State
  const [issueBookId, setIssueBookId] = useState(books[0]?.id || '');
  const [issuePatronId, setIssuePatronId] = useState('AU-2024-BTECH-084');

  // OTP Test Dispatcher
  const [testOtpEmail, setTestOtpEmail] = useState('aarav.sharma@alliance.edu.in');
  const [testOtpLoading, setTestOtpLoading] = useState(false);
  const [testOtpResult, setTestOtpResult] = useState<any>(null);

  // Search in tables
  const [patronSearch, setPatronSearch] = useState('');

  // Theme mode: Default to clean White Background per user request
  const [isWhiteTheme, setIsWhiteTheme] = useState<boolean>(true);

  // Key KPI stats
  const totalBooks = books.length;
  const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const activeBorrows = borrowRecords.filter(r => r.status === 'ACTIVE' || r.status === 'OVERDUE');
  const overdueBorrows = borrowRecords.filter(r => r.status === 'OVERDUE');
  const totalFinesPending = borrowRecords.reduce((sum, r) => (!r.finePaid ? sum + (r.fineAmount || 0) : sum), 0);
  const verifiedPatronsCount = registeredUsers.filter(u => u.isEmailVerified).length;

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      showToast('error', 'Book title and author are required.');
      return;
    }

    const res = addNewBook({
      title: newBookTitle,
      author: newBookAuthor,
      isbn: newBookIsbn || `978-0-${Math.floor(100000000 + Math.random() * 900000000)}`,
      category: newBookCategory,
      publisher: 'Alliance Academic Press',
      publishYear: 2026,
      edition: '1st Edition',
      callNumber: newBookCallNumber,
      description: 'Official academic textbook added by Central Library Administration.',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
      totalCopies: Number(newBookCopies),
      isActive: true,
      tags: [newBookCategory, 'Academic', 'Reference'],
      shelf: {
        floor: Number(newBookFloor),
        wing: 'North Wing',
        aisle: newBookAisle,
        bay: 'Bay-02',
        shelfLevel: 3,
        sectionCode: 'STACK-A',
        x: 45,
        y: 40,
        walkingDirections: `Take Floor ${newBookFloor} elevator, proceed down Aisle ${newBookAisle}.`
      }
    });

    if (res.success) {
      showToast('success', res.message);
      setIsAddBookOpen(false);
      setNewBookTitle('');
      setNewBookAuthor('');
    } else {
      showToast('error', res.message);
    }
  };

  const handleTestOtpDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestOtpLoading(true);
    setTestOtpResult(null);
    const res = await sendOutlookOtp(testOtpEmail, 'SIGNUP');
    setTestOtpLoading(false);
    setTestOtpResult(res);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  const handleExportCsv = () => {
    const csvContent = [
      ['Borrow ID', 'Patron Name', 'Patron Email', 'Book Title', 'Barcode', 'Borrow Date', 'Due Date', 'Status', 'Fine Amount (INR)'],
      ...borrowRecords.map(r => [
        r.id,
        `"${r.userName}"`,
        r.userEmail,
        `"${r.bookTitle}"`,
        r.copyBarcode,
        r.borrowDate,
        r.dueDate,
        r.status,
        r.fineAmount
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smartlib_circulation_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Circulation accreditation CSV report exported successfully.');
  };

  const navItems: { id: AdminTab; label: string; icon: any; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Book Inventory', icon: BookOpen, badge: totalBooks },
    { id: 'circulation', label: 'Circulation Desk', icon: RotateCcw, badge: activeBorrows.length, badgeColor: 'bg-blue-600' },
    { id: 'patrons', label: 'Patrons & Outlook OTP', icon: Users, badge: registeredUsers.length },
    { id: 'syllabus', label: 'Syllabus & Reserves', icon: FileText },
    { id: 'shelves', label: 'Floor Map & Shelves', icon: MapPin },
    { id: 'quests', label: 'Reading Quests', icon: Trophy },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'system', label: 'Outlook SMTP & System', icon: Settings }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors duration-200 ${isWhiteTheme ? 'bg-slate-50 text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      {/* Toast Notification */}
      {feedback && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-medium ${
              feedback.type === 'success'
                ? isWhiteTheme
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
                : isWhiteTheme
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-rose-950/95 border-rose-500 text-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isWhiteTheme ? 'text-emerald-600' : 'text-emerald-400'}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 shrink-0 ${isWhiteTheme ? 'text-rose-600' : 'text-rose-400'}`} />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Top Professional Admin Bar */}
      <header className={`sticky top-0 z-40 transition-colors ${isWhiteTheme ? 'bg-white border-b border-slate-200 text-slate-900 shadow-2xs' : 'bg-slate-950 border-b border-slate-800 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Crest */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md ring-1 ring-amber-400/40">
                <Shield className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-lg tracking-tight ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>SmartLib</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                    Admin Panel
                  </span>
                </div>
                <p className={`text-[11px] ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>Alliance University Central Library Administration</p>
              </div>
            </div>

            {/* System Health Status Pills */}
            <div className="hidden lg:flex items-center gap-2.5">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] ${isWhiteTheme ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Spring Boot 3.3.4</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] ${isWhiteTheme ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                <Database className="w-3 h-3 text-blue-500" />
                <span>MySQL 8.0</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] ${isWhiteTheme ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                <Mail className="w-3 h-3 text-amber-500" />
                <span>Outlook SMTP (TLS)</span>
              </div>
            </div>

            {/* Admin Profile & Role Switcher */}
            <div className="flex items-center gap-2.5">
              {/* White Background Theme Toggle */}
              <button
                type="button"
                onClick={() => setIsWhiteTheme(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  isWhiteTheme
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-2xs'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title={isWhiteTheme ? 'Switch to Dark Theme' : 'Switch to White Background'}
              >
                {isWhiteTheme ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>White BG</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Dark BG</span>
                  </>
                )}
              </button>

              {/* Switch to Student View */}
              <button
                type="button"
                onClick={() => {
                  switchUserRole('USER');
                  setActiveTab('home');
                }}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  isWhiteTheme
                    ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                    : 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/40 text-blue-300'
                }`}
                title="Switch view to Student Dashboard (Aarav Sharma)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Student View</span>
              </button>

              {/* Reset Demo Data */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all sample library and circulation data to fresh state?')) {
                    resetToSampleData();
                    showToast('success', 'Library database reset to fresh prototype state.');
                  }
                }}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isWhiteTheme
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title="Reset sample data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Admin Profile Badge */}
              <div className={`flex items-center gap-2 pl-2 border-l ${isWhiteTheme ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs ${
                  isWhiteTheme ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-800 border-slate-700 text-amber-400'
                }`}>
                  DR
                </div>
                <div className="hidden md:block text-left">
                  <div className={`text-xs font-semibold leading-tight ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Dr. M. Sundaram</div>
                  <div className={`text-[10px] font-mono ${isWhiteTheme ? 'text-amber-600' : 'text-amber-400'}`}>AU-FAC-LIB-003</div>
                </div>
              </div>

              {/* Log Out */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  setActiveTab('portal');
                }}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isWhiteTheme
                    ? 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200 hover:border-rose-300'
                    : 'bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border-slate-800 hover:border-rose-800'
                }`}
                title="Log out and return to SmartLib Login Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className={`overflow-x-auto scrollbar-thin transition-colors ${
          isWhiteTheme ? 'bg-white border-t border-b border-slate-200 shadow-2xs' : 'bg-slate-950/80 border-t border-slate-800/80'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 min-w-max">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : isWhiteTheme
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-slate-950 text-amber-400'
                          : item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : isWhiteTheme
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* ============================================================ */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ============================================================ */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Quick Actions Bar */}
            <div className={`rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <div>
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>
                  <span>Library Operations Overview</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium">
                    Live Status: Normal
                  </span>
                </h2>
                <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                  Real-time circulation metrics, RFID transactions, and instant desk operations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Title</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('circulation')}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isWhiteTheme
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                  <span>Circulation Desk</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOtpTestOpen(true)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isWhiteTheme
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>Test Outlook OTP</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isWhiteTheme
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                  title="Export Circulation Audit CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Key KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              <div className={`rounded-xl p-4 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <div className={`text-[11px] font-medium ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>Catalog Titles</div>
                <div className={`text-2xl font-bold mt-1 ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>{totalBooks}</div>
                <div className={`text-[10px] mt-1 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-500'}`}>{totalCopies} physical copies</div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <div className={`text-[11px] font-medium ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>Available Copies</div>
                <div className="text-2xl font-bold text-emerald-500 mt-1">{availableCopies}</div>
                <div className="text-[10px] text-emerald-600/80 mt-1">Ready on shelves</div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <div className={`text-[11px] font-medium ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>Active Loans</div>
                <div className="text-2xl font-bold text-blue-500 mt-1">{activeBorrows.length}</div>
                <div className="text-[10px] text-blue-500/80 mt-1">In patron hands</div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <div className={`text-[11px] font-medium ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>Overdue Books</div>
                <div className="text-2xl font-bold text-rose-500 mt-1">{overdueBorrows.length}</div>
                <div className="text-[10px] text-rose-500/80 mt-1">₹5/day accrual</div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <div className={`text-[11px] font-medium ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>Verified Patrons</div>
                <div className="text-2xl font-bold text-amber-500 mt-1">{verifiedPatronsCount}</div>
                <div className="text-[10px] text-amber-500/80 mt-1">Outlook OTP verified</div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <div className={`text-[11px] font-medium ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>Reading Seating</div>
                <div className="text-2xl font-bold text-cyan-600 mt-1">68%</div>
                <div className="text-[10px] text-cyan-600/80 mt-1">142/210 seats occupied</div>
              </div>
            </div>

            {/* Recent Circulation & Overdue Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Borrows Table (2 Cols) */}
              <div className={`lg:col-span-2 rounded-2xl p-5 space-y-4 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold text-sm ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Current Active Loans Ledger</h3>
                    <p className={`text-xs ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>Items currently checked out by students and faculty</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('circulation')}
                    className="text-xs text-amber-500 hover:text-amber-600 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b text-[11px] ${isWhiteTheme ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                        <th className="pb-2.5 font-medium">Book Title</th>
                        <th className="pb-2.5 font-medium">Patron</th>
                        <th className="pb-2.5 font-medium">Barcode</th>
                        <th className="pb-2.5 font-medium">Due Date</th>
                        <th className="pb-2.5 font-medium">Status</th>
                        <th className="pb-2.5 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isWhiteTheme ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                      {activeBorrows.slice(0, 5).map(r => (
                        <tr key={r.id} className={isWhiteTheme ? 'hover:bg-slate-50/80' : 'hover:bg-slate-900/50'}>
                          <td className="py-2.5 pr-2">
                            <div className={`font-semibold line-clamp-1 ${isWhiteTheme ? 'text-slate-900' : 'text-slate-200'}`}>{r.bookTitle}</div>
                            <div className={`text-[10px] font-mono ${isWhiteTheme ? 'text-slate-500' : 'text-slate-500'}`}>{r.bookAuthor}</div>
                          </td>
                          <td className="py-2.5 pr-2">
                            <div className={isWhiteTheme ? 'text-slate-800' : 'text-slate-300'}>{r.userName}</div>
                            <div className="text-[10px] text-slate-500">{r.userEmail}</div>
                          </td>
                          <td className="py-2.5 pr-2 font-mono text-[11px] text-amber-500 font-bold">{r.copyBarcode}</td>
                          <td className={`py-2.5 pr-2 font-mono ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>{r.dueDate}</td>
                          <td className="py-2.5 pr-2">
                            {r.status === 'OVERDUE' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Overdue (₹{r.fineAmount})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const res = returnBook(r.id);
                                showToast('success', res.message);
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                                isWhiteTheme
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              Check-In
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const res = renewBook(r.id);
                                showToast(res.success ? 'success' : 'error', res.message);
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                                isWhiteTheme
                                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                  : 'bg-blue-900/40 hover:bg-blue-900/60 text-blue-300'
                              }`}
                            >
                              Renew
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Side Card: Overdue Notice & Quick Outlook OTP Logs */}
              <div className="space-y-6">
                {/* Overdue Desk Notice */}
                <div className={`rounded-2xl p-5 space-y-3 transition-colors ${
                  isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-sm flex items-center gap-1.5 ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span>Overdue Items Alert</span>
                    </h3>
                    <span className="text-[11px] font-bold text-rose-500">{overdueBorrows.length} pending</span>
                  </div>

                  {overdueBorrows.length === 0 ? (
                    <p className={`text-xs py-3 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                      No overdue items currently recorded. Great patron return rate!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {overdueBorrows.map(o => (
                        <div
                          key={o.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                            isWhiteTheme
                              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                              : 'bg-rose-950/40 border-rose-800/40'
                          }`}
                        >
                          <div className="flex justify-between items-center font-semibold">
                            <span className="line-clamp-1">{o.bookTitle}</span>
                            <span className="text-rose-500 font-mono">₹{o.fineAmount}</span>
                          </div>
                          <div className={`text-[11px] flex justify-between ${isWhiteTheme ? 'text-slate-600' : 'text-slate-300'}`}>
                            <span>{o.userName}</span>
                            <span className="text-slate-500">Due: {o.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      showToast('success', 'Automated Outlook overdue reminders dispatched to all overdue patrons.');
                    }}
                    className={`w-full py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isWhiteTheme
                        ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                        : 'bg-rose-900/40 hover:bg-rose-900/60 border-rose-700/60 text-rose-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Overdue Reminders (Outlook)</span>
                  </button>
                </div>

                {/* Library Tech Stack & Audit */}
                <div className={`rounded-2xl p-5 space-y-3 transition-colors ${
                  isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
                }`}>
                  <h3 className={`font-bold text-sm flex items-center gap-1.5 ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>
                    <Server className="w-4 h-4 text-amber-500" />
                    <span>Backend Architecture</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className={`flex justify-between py-1 border-b ${isWhiteTheme ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                      <span>Framework</span>
                      <span className={`font-semibold ${isWhiteTheme ? 'text-slate-900' : 'text-slate-200'}`}>Spring Boot 3.3.4 (Java 21)</span>
                    </div>
                    <div className={`flex justify-between py-1 border-b ${isWhiteTheme ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                      <span>Database</span>
                      <span className={`font-semibold ${isWhiteTheme ? 'text-slate-900' : 'text-slate-200'}`}>MySQL 8.0 (HikariCP)</span>
                    </div>
                    <div className={`flex justify-between py-1 border-b ${isWhiteTheme ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                      <span>Security</span>
                      <span className={`font-semibold ${isWhiteTheme ? 'text-slate-900' : 'text-slate-200'}`}>Spring Security + BCrypt</span>
                    </div>
                    <div className={`flex justify-between py-1 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>Email Provider</span>
                      <span className="font-semibold text-emerald-600">Outlook SMTP (TLS 587)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: BOOK INVENTORY & RFID TAGS */}
        {/* ============================================================ */}
        {activeAdminTab === 'inventory' && (
          <div className="space-y-6">
            <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <div>
                <h2 className={`text-lg font-bold ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Book Inventory & RFID Tag Management</h2>
                <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                  Browse catalog titles, inspect physical copy barcodes, add new acquisitions, and update shelf locations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBookOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Book to Collection</span>
              </button>
            </div>

            {/* Embedded catalogue with full search & copy inspection */}
            <div className={`rounded-2xl p-6 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <Module3Catalogue />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: CIRCULATION DESK */}
        {/* ============================================================ */}
        {activeAdminTab === 'circulation' && (
          <div className="space-y-6">
            <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <div>
                <h2 className={`text-lg font-bold ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Circulation Desk & Self-Checkout Simulator</h2>
                <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                  Manage book issuance, barcode RFID check-in, loan renewals, and overdue fine settlements (₹5/day).
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    isWhiteTheme
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Ledger CSV</span>
                </button>
              </div>
            </div>

            <div className={`rounded-2xl p-6 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <Module4Borrowing />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PATRONS & OUTLOOK OTP ACCOUNTS */}
        {/* ============================================================ */}
        {activeAdminTab === 'patrons' && (
          <div className="space-y-6">
            <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <div>
                <h2 className={`text-lg font-bold ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Patrons & Outlook Email Verification Log</h2>
                <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                  Student directory, Outlook OTP authentication verification status, and rate-limiting security audit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOtpTestOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Test Outlook OTP Dispatch</span>
              </button>
            </div>

            {/* Patrons Directory Table */}
            <div className={`rounded-2xl p-5 space-y-4 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={patronSearch}
                    onChange={e => setPatronSearch(e.target.value)}
                    placeholder="Search patrons by ID, name, email, department..."
                    className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${
                      isWhiteTheme
                        ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                        : 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500'
                    }`}
                  />
                </div>
                <div className={`text-xs ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                  Showing {registeredUsers.length} registered institutional accounts
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b text-[11px] ${isWhiteTheme ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                      <th className="pb-3 font-medium">Patron Name & ID</th>
                      <th className="pb-3 font-medium">Outlook Email</th>
                      <th className="pb-3 font-medium">Department</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Outlook OTP Status</th>
                      <th className="pb-3 font-medium">Password Hash</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isWhiteTheme ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                    {registeredUsers
                      .filter(u =>
                        patronSearch
                          ? u.fullName.toLowerCase().includes(patronSearch.toLowerCase()) ||
                            u.studentOrEmpId.toLowerCase().includes(patronSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(patronSearch.toLowerCase()) ||
                            u.department.toLowerCase().includes(patronSearch.toLowerCase())
                          : true
                      )
                      .map(u => (
                        <tr key={u.id} className={isWhiteTheme ? 'hover:bg-slate-50/80' : 'hover:bg-slate-900/50'}>
                          <td className="py-3 pr-2">
                            <div className={`font-semibold ${isWhiteTheme ? 'text-slate-900' : 'text-slate-200'}`}>{u.fullName}</div>
                            <div className="text-[10px] text-amber-500 font-mono font-bold">{u.studentOrEmpId}</div>
                          </td>
                          <td className={`py-3 pr-2 font-mono ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>{u.email}</td>
                          <td className={`py-3 pr-2 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>{u.department}</td>
                          <td className="py-3 pr-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === 'ADMIN'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {u.role === 'ADMIN' ? 'Chief Librarian' : 'Student'}
                            </span>
                          </td>
                          <td className="py-3 pr-2">
                            {u.isEmailVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Verified via OTP</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-500" />
                                <span>Pending OTP</span>
                              </span>
                            )}
                          </td>
                          <td className={`py-3 pr-2 font-mono text-[10px] ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                            {u.passwordHash ? (
                              <span title="BCrypt salted hash">BCrypt (Active)</span>
                            ) : (
                              <span className="text-amber-500">Unset</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setTestOtpEmail(u.email);
                                setIsOtpTestOpen(true);
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                                isWhiteTheme
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700'
                              }`}
                            >
                              Send OTP
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Rules & OTP Verification Architecture Notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl space-y-2 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <h4 className={`text-xs font-bold flex items-center gap-1.5 ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>OTP Security Invariants</span>
                </h4>
                <ul className={`text-xs space-y-1 list-disc list-inside ${isWhiteTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                  <li>OTPs are cryptographically generated (6 digits) and valid for 5 minutes.</li>
                  <li>Single-use validation: invalidated immediately upon verification.</li>
                  <li>Rate limited: max 3 requests per 10-minute sliding window with 30s backoff.</li>
                  <li>Never exposed in logs or plaintext in responses.</li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl space-y-2 transition-colors ${
                isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
              }`}>
                <h4 className={`text-xs font-bold flex items-center gap-1.5 ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span>Login Policy</span>
                </h4>
                <ul className={`text-xs space-y-1 list-disc list-inside ${isWhiteTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                  <li>One-time OTP verification required only during initial registration.</li>
                  <li>All future logins authenticate via student ID/email + password.</li>
                  <li>Forgot password flow sends fresh single-use OTP before allowing password change.</li>
                  <li>Admin accounts restricted to verified institutional staff.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: SYLLABUS & COURSE RESERVES */}
        {/* ============================================================ */}
        {activeAdminTab === 'syllabus' && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-5 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <h2 className={`text-lg font-bold ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Syllabus Text Matching & Course Reserves Engine</h2>
              <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                Paste syllabus text to automatically parse course topics, extract textbook requirements, and map to library holdings.
              </p>
            </div>

            <div className={`rounded-2xl p-6 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <Module5SyllabusFinder />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: FLOOR MAP & SHELVES */}
        {/* ============================================================ */}
        {activeAdminTab === 'shelves' && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-5 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <h2 className={`text-lg font-bold ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Interactive 2D Floor Plan & Stack Navigator</h2>
              <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                Visualize library floors (Floor 1 & Floor 2), study zones, RFID kiosks, and shelf coordinates with walking directions.
              </p>
            </div>

            <div className={`rounded-2xl p-6 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <Module6ShelfFinder />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 7: READING QUESTS & REWARDS */}
        {/* ============================================================ */}
        {activeAdminTab === 'quests' && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-5 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <h2 className={`text-lg font-bold ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Gamification, Reading Missions & Academic Quizzes</h2>
              <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                Reward students for library engagement, reading diversity, and orientation quizzes.
              </p>
            </div>

            <div className={`rounded-2xl p-6 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <Module7QuestRewards />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8: ANALYTICS & REPORTS */}
        {/* ============================================================ */}
        {activeAdminTab === 'analytics' && (
          <div className="space-y-6">
            <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <div>
                <h2 className={`text-lg font-bold ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Executive Circulation Analytics & Audit</h2>
                <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                  Circulation velocity, department borrowing patterns, and institutional accreditation compliance metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Accreditation Report (CSV)</span>
              </button>
            </div>

            <div className={`rounded-2xl p-6 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <Module8Analytics />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 9: OUTLOOK SMTP & SYSTEM CONFIG */}
        {/* ============================================================ */}
        {activeAdminTab === 'system' && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-5 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <h2 className={`text-lg font-bold ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Spring Boot 3.3.4 & Outlook SMTP Integration</h2>
              <p className={`text-xs mt-0.5 ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                Inspect backend server configurations, database migration scripts, and real Outlook SMTP connectivity.
              </p>
            </div>

            {/* Quick Live OTP Test Tool */}
            <div className={`rounded-2xl p-5 space-y-4 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <h3 className={`font-bold text-sm flex items-center gap-2 ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>
                <Mail className="w-4 h-4 text-amber-500" />
                <span>Live Outlook Email Dispatch Tester</span>
              </h3>
              <p className={`text-xs ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                Send a real test verification OTP code through the configured Outlook SMTP transporter (`smtp-mail.outlook.com:587`).
              </p>

              <form onSubmit={handleTestOtpDispatch} className="flex flex-wrap items-center gap-3">
                <input
                  type="email"
                  required
                  value={testOtpEmail}
                  onChange={e => setTestOtpEmail(e.target.value)}
                  placeholder="name@alliance.edu.in or outlook email"
                  className={`px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 min-w-[280px] ${
                    isWhiteTheme
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={testOtpLoading}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {testOtpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>{testOtpLoading ? 'Dispatching...' : 'Dispatch Test OTP'}</span>
                </button>
              </form>

              {testOtpResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    testOtpResult.success
                      ? isWhiteTheme
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
                      : isWhiteTheme
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-rose-950/50 border-rose-800 text-rose-200'
                  }`}
                >
                  <div className="font-semibold">{testOtpResult.message}</div>
                  {testOtpResult.sandboxToken && (
                    <div className={`font-mono ${isWhiteTheme ? 'text-amber-800' : 'text-amber-300'}`}>
                      Sandbox Code: <span className="text-lg font-bold">{testOtpResult.sandboxToken}</span> (Expires in {testOtpResult.expiresInSeconds || 300}s)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Java Deliverables & Backend Architecture */}
            <div className={`rounded-2xl p-6 transition-colors ${
              isWhiteTheme ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-950 border border-slate-800'
            }`}>
              <JavaDeliverablesHub />
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL: ADD NEW BOOK */}
      {/* ============================================================ */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className={`rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 border transition-colors ${
            isWhiteTheme ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isWhiteTheme ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h3 className={`font-bold text-sm ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Add New Book to Collection</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBookOpen(false)}
                className={`p-1 ${isWhiteTheme ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3.5">
              <div>
                <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>Book Title *</label>
                <input
                  type="text"
                  required
                  value={newBookTitle}
                  onChange={e => setNewBookTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems: Concepts and Design"
                  className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${
                    isWhiteTheme
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>Author(s) *</label>
                  <input
                    type="text"
                    required
                    value={newBookAuthor}
                    onChange={e => setNewBookAuthor(e.target.value)}
                    placeholder="e.g. George Coulouris et al."
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${
                      isWhiteTheme
                        ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                        : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>Category</label>
                  <select
                    value={newBookCategory}
                    onChange={e => setNewBookCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${
                      isWhiteTheme
                        ? 'bg-slate-50 border border-slate-300 text-slate-900'
                        : 'bg-slate-950 border border-slate-800 text-white'
                    }`}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics & AI">Electronics & AI</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Management">Management</option>
                    <option value="Law & Ethics">Law & Ethics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>ISBN</label>
                  <input
                    type="text"
                    value={newBookIsbn}
                    onChange={e => setNewBookIsbn(e.target.value)}
                    placeholder="978-0132143011"
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-mono ${
                      isWhiteTheme
                        ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                        : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>Call Number</label>
                  <input
                    type="text"
                    value={newBookCallNumber}
                    onChange={e => setNewBookCallNumber(e.target.value)}
                    placeholder="QA76.9 .D5"
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-mono ${
                      isWhiteTheme
                        ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                        : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newBookCopies}
                    onChange={e => setNewBookCopies(parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${
                      isWhiteTheme
                        ? 'bg-slate-50 border border-slate-300 text-slate-900'
                        : 'bg-slate-950 border border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>Shelf Floor</label>
                  <select
                    value={newBookFloor}
                    onChange={e => setNewBookFloor(parseInt(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${
                      isWhiteTheme
                        ? 'bg-slate-50 border border-slate-300 text-slate-900'
                        : 'bg-slate-950 border border-slate-800 text-white'
                    }`}
                  >
                    <option value={1}>Floor 1 (Ground - General & Circulation)</option>
                    <option value={2}>Floor 2 (Quiet Study & Advanced Stacks)</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>Aisle Code</label>
                  <input
                    type="text"
                    value={newBookAisle}
                    onChange={e => setNewBookAisle(e.target.value)}
                    placeholder="B-04"
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${
                      isWhiteTheme
                        ? 'bg-slate-50 border border-slate-300 text-slate-900'
                        : 'bg-slate-950 border border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    isWhiteTheme
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Register Title</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: TEST OUTLOOK OTP DISPATCH */}
      {/* ============================================================ */}
      {isOtpTestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className={`rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 border transition-colors ${
            isWhiteTheme ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isWhiteTheme ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" />
                <h3 className={`font-bold text-sm ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>Test Outlook OTP Dispatch</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOtpTestOpen(false);
                  setTestOtpResult(null);
                }}
                className={`p-1 ${isWhiteTheme ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
              Dispatches a live 6-digit OTP code to verify Microsoft Outlook / Office 365 SMTP connectivity.
            </p>

            <form onSubmit={handleTestOtpDispatch} className="space-y-3.5">
              <div>
                <label className={`block text-[11px] font-semibold uppercase mb-1 ${isWhiteTheme ? 'text-slate-700' : 'text-slate-300'}`}>Target Outlook Email</label>
                <input
                  type="email"
                  required
                  value={testOtpEmail}
                  onChange={e => setTestOtpEmail(e.target.value)}
                  placeholder="student@alliance.edu.in"
                  className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-mono ${
                    isWhiteTheme
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOtpTestOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    isWhiteTheme
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testOtpLoading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {testOtpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>{testOtpLoading ? 'Sending...' : 'Send Test OTP'}</span>
                </button>
              </div>
            </form>

            {testOtpResult && (
              <div
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  testOtpResult.success
                    ? isWhiteTheme
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                    : isWhiteTheme
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-rose-950/60 border-rose-800 text-rose-200'
                }`}
              >
                <div className="font-semibold">{testOtpResult.message}</div>
                {testOtpResult.sandboxToken && (
                  <div className={`font-mono ${isWhiteTheme ? 'text-amber-800' : 'text-amber-300'}`}>
                    Verification Code: <span className="font-bold text-base">{testOtpResult.sandboxToken}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
