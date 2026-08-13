import React, { useState } from 'react';
import { UserProfile, TabType } from '../types';
import {
  Calendar,
  Users,
  Settings,
  HelpCircle,
  ChevronRight,
  Plus,
  UserCheck,
  Shield,
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile | null;
  isLoggedIn: boolean;
  onNavigateTab: (tab: TabType) => void;
  onOpenAddCredits: () => void;
  onOpenReferral: () => void;
  onSignUp: (data: { name: string; email: string; password: string; childName?: string; childAge?: number }) => void;
  onLogIn: (data: { email: string; password: string }) => void;
  onLogOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isLoggedIn,
  onNavigateTab,
  onOpenAddCredits,
  onOpenReferral,
  onSignUp,
  onLogIn,
  onLogOut,
}) => {
  // Auth state
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form fields for Log In
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form fields for Sign Up
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('8');

  // Modals state
  const [activeModal, setActiveModal] = useState<'friends' | 'family' | 'settings' | 'help' | 'logoutConfirm' | null>(
    null
  );
  const [familyList, setFamilyList] = useState(user?.familyMembers || []);
  const [newKidName, setNewKidName] = useState('');
  const [newKidAge, setNewKidAge] = useState('8');

  // Sync family list when user changes
  React.useEffect(() => {
    if (user?.familyMembers) {
      setFamilyList(user.familyMembers);
    }
  }, [user]);

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKidName.trim()) return;
    setFamilyList((prev) => [
      ...prev,
      {
        id: `fam_${Date.now()}`,
        name: newKidName,
        age: parseInt(newKidAge) || 8,
        relation: 'Child',
      },
    ]);
    setNewKidName('');
  };

  const handleLogInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }
    onLogIn({ email: loginEmail.trim(), password: loginPassword.trim() });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setAuthError('Please fill in your name, email, and password.');
      return;
    }
    if (signUpPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    onSignUp({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      password: signUpPassword.trim(),
      childName: childName.trim() || undefined,
      childAge: childAge ? parseInt(childAge) : undefined,
    });
  };

  const fillDemoLogin = () => {
    setLoginEmail('alex.johnson@example.com');
    setLoginPassword('password123');
    setAuthError(null);
    onLogIn({ email: 'alex.johnson@example.com', password: 'password123' });
  };

  const fillDemoSignUp = () => {
    setSignUpName('Sarah Lim');
    setSignUpEmail('sarah.lim@example.com');
    setSignUpPassword('happyParent2026');
    setChildName('Oliver Lim');
    setChildAge('7');
    setAuthError(null);
    onSignUp({
      name: 'Sarah Lim',
      email: 'sarah.lim@example.com',
      password: 'happyParent2026',
      childName: 'Oliver Lim',
      childAge: 7,
    });
  };

  // IF NOT LOGGED IN -> RENDER LOG IN / SIGN UP VIEW
  if (!isLoggedIn || !user) {
    return (
      <div className="space-y-6 pb-24 pt-2 max-w-md mx-auto">
        {/* Auth Hero */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0042c8]/10 text-[#0042c8] mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#191c1e] tracking-tight">
            Happy Parents Account
          </h1>
          <p className="text-xs text-[#434656] max-w-xs mx-auto">
            Log in or create a free account to book top Coding, Speech, Art & Sports enrichment classes with credits!
          </p>
        </div>

        {/* Tab Selector */}
        <div className="bg-[#edeef0] p-1 rounded-2xl flex text-xs font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setAuthTab('login');
              setAuthError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'login'
                ? 'bg-white text-[#0042c8] shadow-xs'
                : 'text-[#434656] hover:text-[#191c1e]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Log In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('signup');
              setAuthError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'signup'
                ? 'bg-white text-[#0042c8] shadow-xs'
                : 'text-[#434656] hover:text-[#191c1e]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* LOG IN FORM */}
        {authTab === 'login' && (
          <div className="bg-white rounded-2xl p-6 border border-[#c3c5d9]/30 shadow-xs space-y-4">
            <div className="border-b border-[#c3c5d9]/20 pb-3">
              <h2 className="text-sm font-bold text-[#191c1e]">Welcome Back!</h2>
              <p className="text-[11px] text-[#434656]">Enter your email and password to access your credits & bookings.</p>
            </div>

            <form onSubmit={handleLogInSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#191c1e] block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#747688]" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-xl text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0042c8] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#191c1e] block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#747688]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-xl text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0042c8] focus:bg-white outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747688] hover:text-[#191c1e]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0042c8] text-white font-bold text-xs py-3 rounded-full hover:bg-[#0036a3] active:scale-98 transition-all cursor-pointer shadow-xs mt-2"
              >
                Log In to Account
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c3c5d9]/30"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white px-2 text-[#747688] font-bold">Or Quick Test</span>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemoLogin}
              className="w-full bg-[#f8f9fb] hover:bg-[#edeef0] text-[#0042c8] border border-[#0042c8]/30 font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>⚡ Demo Parent One-Click Log In</span>
            </button>
          </div>
        )}

        {/* SIGN UP FORM */}
        {authTab === 'signup' && (
          <div className="bg-white rounded-2xl p-6 border border-[#c3c5d9]/30 shadow-xs space-y-4">
            <div className="border-b border-[#c3c5d9]/20 pb-3">
              <h2 className="text-sm font-bold text-[#191c1e]">Create Your Parent Account</h2>
              <p className="text-[11px] text-[#434656]">Get 50 bonus credits to start exploring top Singapore enrichment classes!</p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#191c1e] block">Parent Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#747688]" />
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Sarah Lim"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-xl text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0042c8] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#191c1e] block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#747688]" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="sarah.lim@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-xl text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0042c8] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#191c1e] block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#747688]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-9 py-2.5 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-xl text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0042c8] focus:bg-white outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747688] hover:text-[#191c1e]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional Child Info */}
              <div className="pt-2 border-t border-[#c3c5d9]/20 space-y-2">
                <label className="text-xs font-bold text-[#191c1e] block flex items-center justify-between">
                  <span>First Child's Profile (Optional)</span>
                  <span className="text-[10px] text-[#0042c8] font-semibold">For Class Age Matching</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Child's Name (e.g. Oliver)"
                    className="flex-1 px-3 py-2 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-xl text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0042c8] outline-hidden"
                  />
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="Age"
                    className="w-16 px-3 py-2 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-xl text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0042c8] outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0042c8] text-white font-bold text-xs py-3 rounded-full hover:bg-[#0036a3] active:scale-98 transition-all cursor-pointer shadow-xs mt-3"
              >
                Create Account (+50 Free Credits)
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c3c5d9]/30"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white px-2 text-[#747688] font-bold">Or Instant Test</span>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemoSignUp}
              className="w-full bg-[#f8f9fb] hover:bg-[#edeef0] text-[#0042c8] border border-[#0042c8]/30 font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>⚡ One-Click Demo Sign Up</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // IF LOGGED IN -> RENDER FULL USER PROFILE VIEW
  return (
    <div className="space-y-6 pb-24 pt-2 max-w-md mx-auto">
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center space-y-3">
        <div className="relative w-24 h-24">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full rounded-full object-cover shadow-xs border-2 border-[#edeef0]"
          />
          <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#0042c8] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            ✓
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#191c1e] tracking-tight">{user.name}</h1>
          <p className="text-xs font-semibold text-[#0042c8] mt-0.5">{user.email}</p>
          <span className="inline-block mt-1 text-[11px] font-bold text-[#434656] bg-[#f3f4f6] px-2.5 py-0.5 rounded-full border border-[#c3c5d9]/30">
            {user.membership}
          </span>
        </div>
      </section>

      {/* Credits Card */}
      <section className="bg-white rounded-xl p-6 border border-[#c3c5d9]/30 relative overflow-hidden shadow-xs space-y-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#dce1ff] via-white to-white opacity-60 z-0 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-xs font-bold text-[#434656] uppercase tracking-wider mb-2">
            AVAILABLE BALANCE
          </h2>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-[#0042c8] tracking-tight">
              {user.credits}
            </span>
            <span className="text-base font-semibold text-[#0042c8] pb-1">credits</span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1.5 font-medium">
            Renews on {user.renewalDate}
          </p>

          <div className="mt-5">
            <button
              onClick={onOpenAddCredits}
              className="w-full bg-[#0042c8] text-white font-bold text-sm py-3 rounded-full hover:bg-[#003ab2] active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Add Credits
            </button>
          </div>
        </div>
      </section>

      {/* Menu List */}
      <section className="flex flex-col gap-2">
        <button
          onClick={() => onNavigateTab('upcoming')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#edeef0] flex items-center justify-center text-[#44617b] group-hover:text-[#0042c8]">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
              My Classes
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        <button
          onClick={() => setActiveModal('friends')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#edeef0] flex items-center justify-center text-[#44617b] group-hover:text-[#0042c8]">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
              Friends & Referrals
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        <button
          onClick={() => setActiveModal('family')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e8f1ff] flex items-center justify-center text-[#0042c8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors block">
                Family & Kids Profiles
              </span>
              <span className="text-[11px] text-[#434656]">Book kids enrichment classes</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        <button
          onClick={() => setActiveModal('settings')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#edeef0] flex items-center justify-center text-[#44617b] group-hover:text-[#0042c8]">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
              Settings
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        <button
          onClick={() => setActiveModal('help')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#edeef0] flex items-center justify-center text-[#44617b] group-hover:text-[#0042c8]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
              Help Center
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        {/* LOG OUT BUTTON */}
        <button
          onClick={() => setActiveModal('logoutConfirm')}
          className="w-full mt-3 flex items-center justify-center gap-2 p-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-all cursor-pointer active:scale-98"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Account</span>
        </button>
      </section>

      {/* LOG OUT CONFIRMATION MODAL */}
      {activeModal === 'logoutConfirm' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#191c1e]">Log Out</h3>
              <p className="text-xs text-[#434656] mt-1">
                Are you sure you want to log out of your Happy Parents account?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-[#f8f9fb] hover:bg-[#edeef0] text-[#191c1e] font-bold text-xs rounded-full border border-[#c3c5d9]/30 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onLogOut();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTHER MODALS */}
      {activeModal === 'friends' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#191c1e]">Friends & Referrals</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#434656] text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#434656]">
              See what classes your friends are attending or invite friends to earn SGD 20 bonus credits!
            </p>
            <div className="bg-[#f8f9fb] p-3 rounded-lg border border-[#c3c5d9]/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#191c1e]">Sarah Tan</span>
                <span className="text-[#0042c8] font-bold">Booked Align Pilates</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#191c1e]">David Chen</span>
                <span className="text-[#0042c8] font-bold">Booked CodeKids Robotics</span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal(null);
                onOpenReferral();
              }}
              className="w-full bg-[#0042c8] text-white font-bold text-xs py-2.5 rounded-full hover:bg-[#003ab2] cursor-pointer"
            >
              Share Referral Link (Get $20)
            </button>
          </div>
        </div>
      )}

      {activeModal === 'family' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#191c1e]">Family & Kids Profiles</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#434656] text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#434656]">
              Add your children or family dependents to easily reserve Robotics, Coding, or Art enrichment classes!
            </p>

            <div className="space-y-2">
              {familyList.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-[#f8f9fb] rounded-lg border border-[#c3c5d9]/30 flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-[#191c1e]">{member.name}</p>
                    <p className="text-[11px] text-[#434656]">{member.relation} • Age {member.age}</p>
                  </div>
                  <span className="text-[10px] bg-[#e8f1ff] text-[#0042c8] font-bold px-2 py-0.5 rounded-full">
                    Enrichment Ready
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddFamilyMember} className="space-y-2 pt-2 border-t border-[#c3c5d9]/30">
              <label className="text-xs font-bold text-[#191c1e] block">Add Child / Dependent</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Child's Name"
                  value={newKidName}
                  onChange={(e) => setNewKidName(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-md border border-[#c3c5d9] focus:ring-1 focus:ring-[#0042c8]"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={newKidAge}
                  onChange={(e) => setNewKidAge(e.target.value)}
                  className="w-16 text-xs p-2 rounded-md border border-[#c3c5d9] focus:ring-1 focus:ring-[#0042c8]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0042c8] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#003ab2] cursor-pointer"
              >
                + Add Member
              </button>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#191c1e]">Account Settings</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#434656] text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#191c1e]">
              <div className="flex justify-between items-center p-2.5 bg-[#f8f9fb] rounded-lg">
                <span>Class Reminder Push Notifications</span>
                <input type="checkbox" defaultChecked className="accent-[#0042c8]" />
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#f8f9fb] rounded-lg">
                <span>Location Services (Singapore)</span>
                <span className="font-bold text-[#0042c8]">Orchard</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#f8f9fb] rounded-lg">
                <span>Logged in Email</span>
                <span className="font-semibold text-[#434656]">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#191c1e]">Happy Parents Help Center</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#434656] text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#434656]">
              <p className="font-bold text-[#191c1e]">Frequently Asked Questions</p>
              <details className="bg-[#f8f9fb] p-2.5 rounded-lg border border-[#c3c5d9]/30">
                <summary className="font-semibold text-[#191c1e] cursor-pointer">
                  How do class cancellations work?
                </summary>
                <p className="mt-1">
                  Cancel up to 12 hours prior for 100% credit refund instantly back to your balance.
                </p>
              </details>
              <details className="bg-[#f8f9fb] p-2.5 rounded-lg border border-[#c3c5d9]/30">
                <summary className="font-semibold text-[#191c1e] cursor-pointer">
                  Can I book classes for my kids?
                </summary>
                <p className="mt-1">
                  Yes! Select your child in Family Profiles when reserving robotics or coding classes.
                </p>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

