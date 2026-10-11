import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  BookMarked,
  BookOpen,
  Compass,
  FileText,
  MapPin,
  Trophy,
  BarChart3,
  Code2,
  Bell,
  Coins,
  Shield,
  UserCheck,
  RotateCcw,
  Menu,
  X,
  ExternalLink,
  LogOut,
  KeyRound
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  onOpenPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPortal }) => {
  const {
    currentUser,
    switchUserRole,
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    resetToSampleData,
    logout
  } = useLibrary();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'My Loans & Hub', icon: BookMarked },
    { id: 'catalogue', label: 'Catalogue', icon: BookOpen },
    { id: 'borrowing', label: 'Borrow & Return', icon: BookOpen },
    { id: 'syllabus', label: 'Syllabus Finder', icon: FileText },
    { id: 'shelf', label: 'Shelf & Deadlines', icon: MapPin },
    { id: 'quests', label: 'Quest & Rewards', icon: Trophy },
    { id: 'admin', label: 'Admin Panel', icon: Shield, highlight: true },
    { id: 'portal', label: 'Portal (Login)', icon: KeyRound }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Banner: University Announcement & Quick Role Switcher */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Central University Library Hub</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Academic Session 2026-27</span>
            <a
              href="https://library.alliance.edu.in/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 ml-2 font-medium"
            >
              Official Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Role switch toggle */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                onClick={() => {
                  switchUserRole('USER');
                  setActiveTab('home');
                }}
                className={`px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1.5 ${
                  currentUser.role === 'USER'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch active user to Student (Aarav Sharma)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                onClick={() => {
                  switchUserRole('ADMIN');
                  setActiveTab('admin');
                }}
                className={`px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1.5 ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-amber-600 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch active user to Admin (Dr. Meenakshi Sundaram)"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Reset data */}
            <button
              onClick={() => {
                if (window.confirm('Reset sample library data to fresh initial state?')) {
                  resetToSampleData();
                }
              }}
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
              title="Reset state to initial sample records"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-serif">SmartLib</span>
                <span className="text-[10px] tracking-wider uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  UniHub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                Alliance University Library System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : item.highlight
                      ? 'text-amber-300 hover:bg-slate-800 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Learning Points Wallet */}
            <div
              onClick={() => setActiveTab('quests')}
              className="cursor-pointer bg-slate-800 hover:bg-slate-700/80 transition-colors border border-slate-700/80 rounded-lg px-2.5 py-1.5 flex items-center gap-2"
              title="Click to view Library Quest & Rewards"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 leading-none">Wallet</div>
                <div className="text-xs font-bold text-amber-300 leading-none mt-0.5">
                  {currentUser.points} <span className="font-normal text-[10px]">pts</span>
                </div>
              </div>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(prev => !prev)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 relative transition-colors"
                title="View notifications & due date alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            </div>

            {/* Current User Pill */}
            <div
              onClick={() => setActiveTab('auth')}
              className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-800 cursor-pointer hover:opacity-90 transition-opacity"
              title="View authentication session & role permissions (Module 2)"
            >
              <div className="text-right">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                  <span>{currentUser.studentOrEmpId}</span>
                  <span className="text-slate-600">·</span>
                  <span className={`font-semibold ${currentUser.role === 'ADMIN' ? 'text-amber-400' : 'text-blue-400'}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full border border-slate-700 object-cover"
              />
            </div>

            {/* Launch Student Portal Modal Button (Matching image.png) */}
            <button
              onClick={() => {
                setActiveTab('portal');
                if (onOpenPortal) onOpenPortal();
              }}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Open full-screen Student Portal Login / OTP Verification Screen"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Portal Login</span>
            </button>

            {/* Log Out Button */}
            <button
              onClick={() => {
                logout();
                setActiveTab('portal');
                if (onOpenPortal) onOpenPortal();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700/80 transition-colors cursor-pointer"
              title="Log out and return to Student Portal verification screen"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <div className="py-2 mb-2 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">{currentUser.fullName}</div>
              <div className="text-[10px] text-slate-400">{currentUser.email} ({currentUser.role})</div>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> {currentUser.points} pts
            </div>
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2.5 text-xs font-medium rounded-lg text-left flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
