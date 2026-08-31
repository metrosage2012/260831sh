import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, Check, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from './LoginBar';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      const mockProfiles: Record<string, UserProfile> = {
        google: { name: '구글 미식탐험가', email: 'gourmet_user@gmail.com', level: 'VIP' },
        kakao: { name: '카카오 식도락가', email: 'kakao_foodie@kakao.com', level: 'GOURMET' },
        naver: { name: '네이버 맛집탐방러', email: 'naver_traveler@naver.com', level: 'VIP' },
      };
      const selected = mockProfiles[provider];
      onLoginSuccess(selected);
      setLoading(false);
      onClose();
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('비밀번호는 4자리 이상 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      const displayName = tab === 'signup' 
        ? (name.trim() || email.split('@')[0])
        : (email.split('@')[0] || '미식가 회원');

      onLoginSuccess({
        name: displayName,
        email: email,
        level: tab === 'signup' ? 'NEW GOURMET' : 'VIP'
      });
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div 
      id="login-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="login-modal-container"
        className="relative w-full max-w-md bg-[#111111] text-white rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="login-modal-close-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF4D00] text-black font-black text-2xl italic shadow-lg shadow-[#FF4D00]/25 mb-1">
            S
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            SEOUL GOURMET <span className="text-[#FF4D00]">.</span>
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            로그인하고 나만의 서울 미식 코스와 솔직한 방문 리뷰를 기록해보세요.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#181818] p-1 rounded-full border border-white/5 text-xs font-bold">
          <button
            id="tab-login-btn"
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-full transition-all ${
              tab === 'login'
                ? 'bg-white text-black shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            로그인 (Sign In)
          </button>
          <button
            id="tab-signup-btn"
            type="button"
            onClick={() => { setTab('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-full transition-all ${
              tab === 'signup'
                ? 'bg-white text-black shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            회원가입 (Sign Up)
          </button>
        </div>

        {/* 1-Click Fast Social Login */}
        <div className="space-y-2">
          <button
            id="social-login-google"
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-neutral-100 text-black font-bold text-xs flex items-center justify-center gap-2.5 transition-all active:scale-98 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27A7.115 7.115 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.967 11.967 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Google 계정으로 빠른 시작</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="social-login-kakao"
              type="button"
              onClick={() => handleSocialLogin('kakao')}
              disabled={loading}
              className="py-2.5 px-3 rounded-full bg-[#FEE500] hover:bg-[#edd400] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <span className="font-extrabold text-xs">Kakao</span>
              <span>로그인</span>
            </button>
            <button
              id="social-login-naver"
              type="button"
              onClick={() => handleSocialLogin('naver')}
              disabled={loading}
              className="py-2.5 px-3 rounded-full bg-[#03C75A] hover:bg-[#02b150] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <span className="font-black text-xs">NAVER</span>
              <span>로그인</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-mono tracking-widest text-neutral-500">
            OR WITH EMAIL
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-2.5 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {tab === 'signup' && (
            <div className="space-y-1">
              <label className="font-bold text-neutral-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#FF4D00]" />
                닉네임
              </label>
              <input
                id="login-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 을지로미식가"
                className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-neutral-300 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#FF4D00]" />
              이메일 주소
            </label>
            <input
              id="login-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gourmet@seoul.kr"
              className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#FF4D00]" />
              비밀번호
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-full bg-[#FF4D00] hover:bg-[#ff5d1a] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF4D00]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            {loading ? (
              <span>처리 중...</span>
            ) : (
              <>
                <span>{tab === 'login' ? '로그인 (SIGN IN)' : '회원가입 완료 (CREATE ACCOUNT)'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
