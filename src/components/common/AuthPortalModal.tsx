import React, { useState, useEffect } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  BookOpen,
  Lock,
  Mail,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface AuthPortalModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialMode?: 'ID_INPUT' | 'PASSWORD_LOGIN' | 'SIGNUP_EMAIL' | 'OTP_VERIFY' | 'SET_PASSWORD' | 'FORGOT_PASSWORD';
  isStandalonePage?: boolean;
}

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'ID_INPUT',
  isStandalonePage = false
}) => {
  const {
    loginWithPassword,
    sendOutlookOtp,
    verifyOutlookOtp,
    completeSignupWithPassword,
    resetPasswordWithOtpToken,
    registeredUsers,
    setIsAuthenticated,
    setActiveTab,
    switchUserRole
  } = useLibrary();

  // Primary Role View: STUDENT vs ADMIN
  const [portalRole, setPortalRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');

  // Background Theme Mode (defaulting to clean WHITE background per user request)
  const [isWhiteBackground, setIsWhiteBackground] = useState<boolean>(true);

  // Mode machine for Student flow:
  // 'ID_INPUT' matches the exact uploaded image.png
  const [mode, setMode] = useState<
    'ID_INPUT' | 'PASSWORD_LOGIN' | 'SIGNUP_EMAIL' | 'OTP_VERIFY' | 'SET_PASSWORD' | 'FORGOT_PASSWORD'
  >(initialMode);

  // Form Fields - Student
  const [studentId, setStudentId] = useState('');
  const [outlookEmail, setOutlookEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields - Admin
  const [adminEmpId, setAdminEmpId] = useState('AU-FAC-LIB-003');
  const [adminPassword, setAdminPassword] = useState('Admin@SmartLib2026');

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<'SIGNUP' | 'PASSWORD_RESET'>('SIGNUP');
  const [sandboxToken, setSandboxToken] = useState<string | null>(null);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen) return null;

  // 1. Initial Continue (The exact action on image.png)
  const handleInitialContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanId = studentId.trim();
    if (!cleanId) {
      setErrorMsg('Student registration number is required.');
      return;
    }

    // Check if patron already has an activated account
    const existing = registeredUsers.find(
      u => u.studentOrEmpId.toLowerCase() === cleanId.toLowerCase() ||
           u.email.toLowerCase() === cleanId.toLowerCase() ||
           u.username.toLowerCase() === cleanId.toLowerCase()
    );

    if (existing && existing.passwordHash) {
      // Returning user -> Direct password login without OTP
      setMode('PASSWORD_LOGIN');
      setOutlookEmail(existing.email);
      setFullName(existing.fullName);
      setPassword('SmartLib@2026');
    } else {
      // First-time student -> Outlook OTP verification
      setMode('SIGNUP_EMAIL');
      setOutlookEmail(`${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '')}@alliance.edu.in`);
    }
  };

  // 2. Send Outlook OTP for Signup
  const handleSendSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!outlookEmail || !outlookEmail.includes('@')) {
      setErrorMsg('Please enter a valid Outlook or university email address.');
      return;
    }

    setLoading(true);
    setOtpPurpose('SIGNUP');

    const res = await sendOutlookOtp(outlookEmail, 'SIGNUP');
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setSuccessMsg(res.message);
    setTimerSeconds(res.expiresInSeconds || 300);
    setIsTimerRunning(true);
    if (res.sandboxToken) {
      setSandboxToken(res.sandboxToken);
    }
    setMode('OTP_VERIFY');
  };

  // 3. Send Outlook OTP for Forgot Password
  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!outlookEmail || !outlookEmail.includes('@')) {
      setErrorMsg('Please enter your registered university email.');
      return;
    }

    setLoading(true);
    setOtpPurpose('PASSWORD_RESET');

    const res = await sendOutlookOtp(outlookEmail, 'PASSWORD_RESET');
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setSuccessMsg(res.message);
    setTimerSeconds(res.expiresInSeconds || 300);
    setIsTimerRunning(true);
    if (res.sandboxToken) {
      setSandboxToken(res.sandboxToken);
    }
    setMode('OTP_VERIFY');
  };

  // 4. Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fullOtp = otpDigits.join('').trim();
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyOutlookOtp(outlookEmail, fullOtp);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setVerificationToken(res.verificationToken || 'verified_token');
    setSuccessMsg('OTP verified successfully! Now set your account password.');
    setMode('SET_PASSWORD');
  };

  // 5. Save Password (BCrypt hashed on backend)
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (otpPurpose === 'PASSWORD_RESET') {
      const res = resetPasswordWithOtpToken(outlookEmail, password, verificationToken);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }
      setSuccessMsg(res.message);
      setTimeout(() => setMode('PASSWORD_LOGIN'), 1200);
    } else {
      const res = completeSignupWithPassword({
        studentId: studentId || 'AU-2025-CSE-092',
        email: outlookEmail,
        fullName: fullName || 'Alliance Scholar',
        department: 'School of Computing',
        password,
        verificationToken
      });

      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }

      setSuccessMsg(res.message);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1200);
    }
  };

  // 6. Direct Password Login for Returning Patrons (NO OTP needed)
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const identifier = studentId || outlookEmail;
    const res = loginWithPassword(identifier, password);

    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setSuccessMsg(res.message);
    setTimeout(() => {
      if (onClose) onClose();
    }, 600);
  };

  // Admin Login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginWithPassword(adminEmpId, adminPassword);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }
    setSuccessMsg('Admin credentials verified. Opening Central Library Administration Panel...');
    setTimeout(() => {
      switchUserRole('ADMIN');
      setActiveTab('admin');
      if (onClose) onClose();
    }, 500);
  };

  // Quick evaluation presets
  const handleQuickStudent = () => {
    const res = loginWithPassword('AU-2024-BTECH-084', 'SmartLib@2026');
    if (res.success) {
      switchUserRole('USER');
      setActiveTab('home');
      if (onClose) onClose();
    } else {
      setPortalRole('STUDENT');
      setStudentId('AU-2024-BTECH-084');
      setPassword('SmartLib@2026');
      setMode('PASSWORD_LOGIN');
    }
  };

  const handleQuickAdmin = () => {
    const res = loginWithPassword('AU-FAC-LIB-003', 'Admin@SmartLib2026');
    if (res.success) {
      switchUserRole('ADMIN');
      setActiveTab('admin');
      if (onClose) onClose();
    } else {
      setPortalRole('ADMIN');
      setAdminEmpId('AU-FAC-LIB-003');
      setAdminPassword('Admin@SmartLib2026');
    }
  };

  const handleQuickSignup = () => {
    setPortalRole('STUDENT');
    setStudentId('AU-2025-CSE-092');
    setOutlookEmail('au2025cse092@alliance.edu.in');
    setFullName('Ananya Sen');
    setMode('SIGNUP_EMAIL');
  };

  // Dynamic styling variables based on background theme:
  const isDark = !isWhiteBackground;
  const cardBg = isWhiteBackground
    ? 'bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] text-slate-900'
    : 'bg-[#131b28]/95 backdrop-blur-md border border-[#243348]/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] text-white';

  const headingText = isWhiteBackground ? 'text-slate-900' : 'text-white';
  const subText = isWhiteBackground ? 'text-slate-500' : 'text-slate-400';
  const fieldLabel = isWhiteBackground ? 'text-slate-700' : 'text-slate-300';
  const inputBg = isWhiteBackground
    ? 'bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-slate-900 placeholder-slate-400 font-medium'
    : 'bg-[#0b1019] border border-[#222e42] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-white placeholder-[#64748b] font-medium';
  const dividerBorder = isWhiteBackground ? 'border-slate-200' : 'border-[#1e293b]';

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 selection:bg-amber-500 font-sans ${isWhiteBackground ? 'bg-slate-50 text-slate-900 selection:text-white' : 'text-slate-100 selection:text-slate-900'}`}>
      {/* University Library Interior Background with White or Navy Overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: isWhiteBackground
            ? `linear-gradient(rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.97)), url('/library_atrium.jpg')`
            : `linear-gradient(rgba(10, 16, 28, 0.72), rgba(8, 14, 25, 0.88)), url('/library_atrium.jpg')`
        }}
      />

      {/* Ambient Vignette Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-500 ${
          isWhiteBackground
            ? 'bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(241,245,249,0.85)_95%)]'
            : 'bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(6,10,20,0.85)_95%)]'
        }`}
      />

      {/* Top Floating App Bar */}
      <div className="fixed top-4 left-4 right-4 z-20 max-w-5xl mx-auto flex items-center justify-between pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              setIsAuthenticated(true);
              setActiveTab('home');
            }
          }}
          className={`px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-medium flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
            isWhiteBackground
              ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-amber-400'
              : 'bg-[#0d1420]/85 border-[#223046] text-slate-300 hover:text-white hover:border-amber-400/50'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
          <span>Return to SmartLib Hub</span>
        </button>

        {/* Center Theme Toggle & Info Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs shadow-lg ${
              isWhiteBackground
                ? 'bg-white/90 border-slate-200 text-slate-700'
                : 'bg-[#0d1420]/85 border-[#223046] text-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`font-semibold ${isWhiteBackground ? 'text-slate-900' : 'text-white'}`}>SmartLib Portal</span>
            <span className="text-slate-400">|</span>
            <span className="text-amber-500 font-medium">Alliance University</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsWhiteBackground(prev => !prev)}
            className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isWhiteBackground
                ? 'bg-white border-amber-300 text-amber-900 hover:bg-amber-50'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
            title={isWhiteBackground ? 'Switch to Dark Navy Theme' : 'Switch to White Background Theme'}
          >
            {isWhiteBackground ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-bold">White BG</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px]">Dark BG</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(true);
            setActiveTab('catalogue');
            if (onClose) onClose();
          }}
          className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
        >
          <span>Explore Catalogue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="relative z-10 w-full max-w-[440px] my-auto pt-10 sm:pt-4">
        <div className={`rounded-[22px] px-8 py-8 sm:px-9 sm:py-8 space-y-5 relative overflow-hidden transition-all duration-300 ${cardBg}`}>
          {/* Close button if modal or onClose provided */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer ${
                isWhiteBackground ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}
              title="Close Portal"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Subtle Warm Golden Ambient Glow above the logo */}
          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 blur-2xl pointer-events-none rounded-full ${
              isWhiteBackground ? 'bg-amber-400/20' : 'bg-amber-400/15'
            }`}
          />

          {/* Logo & Header Row */}
          <div className="text-center space-y-1.5 relative">
            <div className="inline-flex items-center gap-2">
              {/* Golden Book Icon */}
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center relative ${
                  isWhiteBackground
                    ? 'border-amber-400/80 bg-amber-50 text-amber-600'
                    : 'border-amber-400/80 bg-amber-400/10 text-amber-400'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span
                  className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ${
                    isWhiteBackground ? 'ring-white' : 'ring-[#131b28]'
                  }`}
                />
              </div>

              {/* SmartLib text */}
              <span className={`font-bold text-xl tracking-tight font-sans ${isWhiteBackground ? 'text-slate-900' : 'text-white'}`}>
                Smart<span className="text-amber-500">Lib</span>
              </span>

              {/* AU Badge */}
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 border border-amber-400/40 tracking-wider">
                AU
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className={`text-2xl font-bold tracking-tight pt-1 ${headingText}`}>
              Welcome to SmartLib
            </h1>
            <p className={`text-xs font-medium ${subText}`}>
              Your University Library, Reimagined
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role Toggle Selector */}
          <div
            className={`flex p-1 rounded-xl border ${
              isWhiteBackground ? 'bg-slate-100 border-slate-200' : 'bg-[#0b1019] border-[#222e42]'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setPortalRole('STUDENT');
                setMode('ID_INPUT');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                portalRole === 'STUDENT'
                  ? isWhiteBackground
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300/80 font-bold'
                    : 'bg-[#1e293b] text-white shadow-sm border border-slate-700/60'
                  : isWhiteBackground
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPortalRole('ADMIN');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                portalRole === 'ADMIN'
                  ? isWhiteBackground
                    ? 'bg-white text-amber-800 shadow-xs border border-amber-300 font-bold'
                    : 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-400/40'
                  : isWhiteBackground
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* ADMIN PORTAL LOGIN FORM */}
          {/* ======================================================== */}
          {portalRole === 'ADMIN' ? (
            <form onSubmit={handleAdminLogin} className="space-y-4 pt-1">
              <div className="text-center pb-1">
                <div className={`text-xs font-semibold ${isWhiteBackground ? 'text-amber-700' : 'text-amber-300'}`}>
                  Central Library Administration
                </div>
                <p className={`text-[11px] ${subText}`}>Restricted to authorized circulation staff & librarians.</p>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-bold tracking-wider mb-2 uppercase">
                  <span className={fieldLabel}>LIBRARIAN / EMPLOYEE ID</span>
                  <span className="text-amber-500 font-mono text-[10px]">AU-FAC-LIB-003</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-amber-500 text-sm font-bold select-none">
                    #
                  </span>
                  <input
                    type="text"
                    required
                    value={adminEmpId}
                    onChange={e => setAdminEmpId(e.target.value)}
                    placeholder="AU-FAC-LIB-003"
                    className={`w-full pl-9 pr-3.5 py-3 rounded-xl font-mono tracking-wide focus:outline-none transition-colors ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-bold tracking-wider mb-2 uppercase">
                  <span className={fieldLabel}>ADMIN PASSWORD</span>
                  <span className={`${subText} font-mono text-[10px]`}>Admin@SmartLib2026</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full pl-9 pr-10 py-3 rounded-xl font-medium focus:outline-none ${inputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className={`absolute right-3 top-3 ${isWhiteBackground ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0f172a] font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#0f172a]" />
                <span>Enter Central Library Admin Panel</span>
                <ArrowRight className="w-4 h-4 text-[#0f172a]" />
              </button>
            </form>
          ) : (
            <>
              {/* ======================================================== */}
              {/* STEP 1: INITIAL REFERENCE SCREEN (Exact UI from image.png) */}
              {/* ======================================================== */}
              {mode === 'ID_INPUT' && (
                <form onSubmit={handleInitialContinue} className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-wider mb-2 uppercase">
                      <span className={fieldLabel}>STUDENT REGISTRATION NUMBER</span>
                      <span className={`${subText} font-normal normal-case text-[10px]`}>Required</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-amber-500 text-sm font-bold select-none">
                        #
                      </span>
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                        placeholder="Enter your registration number"
                        className={`w-full pl-9 pr-3.5 py-3 rounded-xl font-medium tracking-wide focus:outline-none transition-colors ${inputBg}`}
                      />
                    </div>
                  </div>

                  {/* Prominent Golden Amber Gradient Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0f172a] font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Continue to Verification</span>
                    <ArrowRight className="w-4 h-4 text-[#0f172a]" />
                  </button>

                  <div className={`flex items-center justify-between text-[11px] pt-1 ${subText}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentId('AU-2024-BTECH-084');
                        setMode('PASSWORD_LOGIN');
                      }}
                      className="hover:text-amber-500 transition-colors"
                    >
                      Returning Student? Sign In &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('SIGNUP_EMAIL')}
                      className="hover:text-amber-500 transition-colors"
                    >
                      First-Time Signup
                    </button>
                  </div>
                </form>
              )}

              {/* ======================================================== */}
              {/* STEP 2: RETURNING STUDENT LOGIN (Password-only, NO OTP) */}
              {/* ======================================================== */}
              {mode === 'PASSWORD_LOGIN' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-wider mb-2 uppercase">
                      <span className={fieldLabel}>REGISTRATION NUMBER OR EMAIL</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-amber-500 text-sm font-bold select-none">
                        #
                      </span>
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                        placeholder="AU-2024-BTECH-084"
                        className={`w-full pl-9 pr-3.5 py-3 rounded-xl font-medium focus:outline-none ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-wider mb-2 uppercase">
                      <span className={fieldLabel}>ACCOUNT PASSWORD</span>
                      <button
                        type="button"
                        onClick={() => {
                          setOutlookEmail(studentId.includes('@') ? studentId : 'aarav.sharma@alliance.edu.in');
                          setMode('FORGOT_PASSWORD');
                        }}
                        className="text-amber-500 hover:underline normal-case font-medium text-[10px]"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className={`w-full pl-9 pr-9 py-3 rounded-xl font-mono focus:outline-none ${inputBg}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className={`absolute right-3 top-3 ${isWhiteBackground ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0f172a] font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Sign In to Library</span>
                    <ArrowRight className="w-4 h-4 text-[#0f172a]" />
                  </button>

                  <div className={`flex items-center justify-between text-[11px] pt-1 ${subText}`}>
                    <button
                      type="button"
                      onClick={() => setMode('ID_INPUT')}
                      className="hover:text-amber-500"
                    >
                      &larr; Back to Registration #
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('SIGNUP_EMAIL')}
                      className="text-amber-500 hover:underline font-semibold"
                    >
                      First-Time Signup
                    </button>
                  </div>
                </form>
              )}

              {/* ======================================================== */}
              {/* STEP 3: FIRST-TIME OUTLOOK EMAIL INPUT (Real OTP Dispatch) */}
              {/* ======================================================== */}
              {mode === 'SIGNUP_EMAIL' && (
                <form onSubmit={handleSendSignupOtp} className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-wider mb-2 uppercase">
                      <span className={fieldLabel}>STUDENT FULL NAME</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Kavya Natarajan"
                      className={`w-full px-3.5 py-3 rounded-xl font-medium focus:outline-none ${inputBg}`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-wider mb-2 uppercase">
                      <span className={fieldLabel}>OUTLOOK / UNIVERSITY EMAIL</span>
                      <span className="text-amber-500">Required</span>
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={outlookEmail}
                        onChange={e => setOutlookEmail(e.target.value)}
                        placeholder="student@alliance.edu.in or outlook.com"
                        className={`w-full pl-9 pr-3.5 py-3 rounded-xl font-medium focus:outline-none ${inputBg}`}
                      />
                    </div>
                    <p className={`text-[10px] pt-1 ${subText}`}>
                      A single-use 6-digit OTP will be dispatched via Outlook SMTP.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0f172a] font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{loading ? 'Dispatching OTP...' : 'Send Verification OTP'}</span>
                    <ArrowRight className="w-4 h-4 text-[#0f172a]" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setMode('ID_INPUT')}
                      className={`text-[11px] ${subText} hover:text-amber-500`}
                    >
                      &larr; Back to Registration Number
                    </button>
                  </div>
                </form>
              )}

              {/* ======================================================== */}
              {/* STEP 4: ENTER 6-DIGIT OTP (Expires in 5 minutes) */}
              {/* ======================================================== */}
              {mode === 'OTP_VERIFY' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                  <div className="text-center space-y-1">
                    <p className={`text-xs ${subText}`}>
                      Verification code dispatched to:
                    </p>
                    <p className="text-xs font-bold text-amber-500 font-mono">
                      {outlookEmail}
                    </p>
                    <div className={`flex items-center justify-center gap-1.5 text-xs pt-1 ${subText}`}>
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        Expires in: <strong className={`font-mono ${headingText}`}>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</strong>
                      </span>
                    </div>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div className="flex justify-between gap-1.5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`auth-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const copy = [...otpDigits];
                          copy[idx] = val;
                          setOtpDigits(copy);
                          if (val && idx < 5) {
                            const next = document.getElementById(`auth-otp-${idx + 1}`);
                            next?.focus();
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Backspace' && !digit && idx > 0) {
                            const prev = document.getElementById(`auth-otp-${idx - 1}`);
                            prev?.focus();
                          }
                        }}
                        className={`w-11 h-12 text-center text-lg font-bold font-mono rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                          isWhiteBackground
                            ? 'bg-white border border-slate-300 text-slate-900 shadow-xs'
                            : 'bg-[#0b1019] border border-[#222e42] text-white'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Development helper token if SMTP credentials are unset */}
                  {sandboxToken && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-center justify-between">
                      <span>Development Preview OTP: <strong className="font-mono text-blue-950 text-xs font-bold">{sandboxToken}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtpDigits(sandboxToken.split(''))}
                        className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-semibold"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0f172a] font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{loading ? 'Verifying OTP...' : 'Verify OTP Code'}</span>
                    <Check className="w-4 h-4 text-[#0f172a]" />
                  </button>

                  <div className={`flex items-center justify-between text-[11px] pt-1 ${subText}`}>
                    <button
                      type="button"
                      onClick={() => setMode('SIGNUP_EMAIL')}
                      className="hover:text-amber-500"
                    >
                      Change Email
                    </button>
                    <button
                      type="button"
                      disabled={timerSeconds > 270}
                      onClick={e => {
                        if (otpPurpose === 'PASSWORD_RESET') handleSendForgotOtp(e);
                        else handleSendSignupOtp(e);
                      }}
                      className="text-amber-500 hover:underline disabled:opacity-40"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}

              {/* ======================================================== */}
              {/* STEP 5: CREATE ACCOUNT PASSWORD (Min 8 chars) */}
              {/* ======================================================== */}
              {mode === 'SET_PASSWORD' && (
                <form onSubmit={handleSavePassword} className="space-y-4 pt-1">
                  <div className="text-center space-y-1">
                    <h3 className={`text-sm font-bold ${headingText}`}>
                      {otpPurpose === 'PASSWORD_RESET' ? 'Set New Account Password' : 'Create Account Password'}
                    </h3>
                    <p className={`text-xs ${subText}`}>
                      Use this password for all future logins. (No OTP needed)
                    </p>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold tracking-wider mb-2 uppercase ${fieldLabel}`}>
                      NEW PASSWORD <span className="text-rose-500">* (Min 8 chars)</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className={`w-full pl-9 pr-9 py-3 rounded-xl font-mono focus:outline-none ${inputBg}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className={`absolute right-3 top-3 ${isWhiteBackground ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold tracking-wider mb-2 uppercase ${fieldLabel}`}>
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className={`w-full pl-9 pr-3.5 py-3 rounded-xl font-mono focus:outline-none ${inputBg}`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0f172a] font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{otpPurpose === 'PASSWORD_RESET' ? 'Update Password' : 'Save Password & Enter Library'}</span>
                    <Check className="w-4 h-4 text-[#0f172a]" />
                  </button>
                </form>
              )}

              {/* ======================================================== */}
              {/* STEP 6: FORGOT PASSWORD FLOW */}
              {/* ======================================================== */}
              {mode === 'FORGOT_PASSWORD' && (
                <form onSubmit={handleSendForgotOtp} className="space-y-4 pt-1">
                  <div className="text-center space-y-1">
                    <h3 className={`text-sm font-bold ${headingText}`}>Reset Account Password</h3>
                    <p className={`text-xs ${subText}`}>
                      Enter your registered Outlook email to receive a password reset code.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-wider mb-2 uppercase">
                      <span className={fieldLabel}>REGISTERED OUTLOOK EMAIL</span>
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={outlookEmail}
                        onChange={e => setOutlookEmail(e.target.value)}
                        placeholder="student@alliance.edu.in"
                        className={`w-full pl-9 pr-3.5 py-3 rounded-xl font-medium focus:outline-none ${inputBg}`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0f172a] font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{loading ? 'Dispatching OTP...' : 'Send Password Reset Code'}</span>
                    <ArrowRight className="w-4 h-4 text-[#0f172a]" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setMode('PASSWORD_LOGIN')}
                      className={`text-[11px] ${subText} hover:text-amber-500`}
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Quick Shortcuts for Evaluation */}
          <div className={`pt-2 border-t space-y-2 ${dividerBorder}`}>
            <div className={`flex items-center justify-between text-[11px] ${subText}`}>
              <span className={`font-semibold ${isWhiteBackground ? 'text-slate-800' : 'text-slate-300'}`}>Fast Demo Presets:</span>
              <span className="text-[10px]">1-Click Evaluation</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className={`py-2 px-2.5 rounded-xl border font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isWhiteBackground
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/30 text-amber-300'
                }`}
                title="Log in directly as Dr. Meenakshi Sundaram and open Admin Panel"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Enter as Admin</span>
              </button>
              <button
                type="button"
                onClick={handleQuickStudent}
                className={`py-2 px-2.5 rounded-xl border font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isWhiteBackground
                    ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900'
                    : 'bg-blue-500/15 hover:bg-blue-500/25 border-blue-400/30 text-blue-300'
                }`}
                title="Log in directly as Aarav Sharma and open Student Dashboard"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Enter as Student</span>
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleQuickSignup}
                className={`text-[11px] transition-colors cursor-pointer ${
                  isWhiteBackground ? 'text-slate-500 hover:text-amber-600' : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                ⚡ Test First-Time Outlook OTP Signup Flow
              </button>
            </div>
          </div>

          {/* Card Footer */}
          <div className={`pt-1 text-center space-y-1.5 border-t ${dividerBorder}`}>
            <div className={`flex items-center justify-center gap-1.5 text-[11px] ${subText}`}>
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Interactive Student Portal · SSL Encrypted</span>
            </div>
            <p className={`text-[10px] ${subText}`}>
              SmartLib Prototype | Alliance University
            </p>
          </div>
        </div>

        {/* Bottom Bar on the Floor */}
        <div className="mt-5 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border text-[11px] shadow-lg ${
              isWhiteBackground
                ? 'bg-white/95 border-slate-200 text-slate-600'
                : 'bg-[#0d1420]/80 border-[#1e2a3d] text-slate-400'
            }`}
          >
            <span>Alliance University Central Library</span>
            <span>·</span>
            <span>Bengaluru, Karnataka</span>
            <span>·</span>
            <span className="text-amber-600 font-semibold">Authorized Student Access Only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
