import React from 'react';
import { User, LogIn, LogOut, Sparkles, Shield, Bookmark, MapPin, CheckCircle2 } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  level?: string;
}

interface LoginBarProps {
  user: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
}

export const LoginBar: React.FC<LoginBarProps> = ({
  user,
  onOpenLogin,
  onLogout,
  onOpenWishlist,
  wishlistCount,
}) => {
  return (
    <aside 
      id="top-login-bar"
      aria-label="회원 로그인 바"
      className="bg-[#050505] text-neutral-300 text-[11px] border-b border-white/10 py-2 px-4 sm:px-6 lg:px-8 relative z-50 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left Side: Live Metropolitan Status & City Guide Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#FF4D00] uppercase font-bold bg-[#FF4D00]/10 px-2.5 py-0.5 rounded-full border border-[#FF4D00]/25 shadow-sm shadow-[#FF4D00]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse"></span>
            LIVE
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-neutral-400 font-medium">
            <span className="text-white font-bold tracking-tight">SEOUL METROPOLITAN</span>
            <span className="text-neutral-600">·</span>
            <span>8대 미식 권역 실시간 데이터 연동 중</span>
          </div>
        </div>

        {/* Center: Subtle Notice */}
        <div className="hidden lg:flex items-center gap-1.5 text-neutral-400 text-[11px]">
          <Sparkles className="w-3 h-3 text-[#FF4D00]" />
          <span>미슐랭 & 노포 헤리티지 2026 에디션 업데이트 완료</span>
        </div>

        {/* Right Side: Login & User Account Controls */}
        <div className="flex items-center gap-2">
          {user ? (
            /* Logged-In User Profile Controls */
            <div className="flex items-center gap-2">
              <div 
                id="user-profile-badge"
                className="flex items-center gap-1.5 bg-[#141414] border border-white/10 hover:border-[#FF4D00]/40 px-3 py-1 rounded-full text-white font-bold transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-[#FF4D00] text-black font-black text-[9px] flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] truncate max-w-[120px]">{user.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FF4D00]/20 text-[#FF4D00] font-mono border border-[#FF4D00]/30 font-extrabold">
                  {user.level || 'VIP'}
                </span>
              </div>

              {/* Quick Wishlist link */}
              <button
                id="topbar-wishlist-btn"
                type="button"
                onClick={onOpenWishlist}
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] hover:bg-[#222222] text-neutral-300 hover:text-white border border-white/10 transition-colors font-medium text-[11px]"
              >
                <Bookmark className="w-3 h-3 text-[#FF4D00]" />
                <span>나의 찜 ({wishlistCount})</span>
              </button>

              {/* Logout Button */}
              <button
                id="topbar-logout-btn"
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-300 border border-white/10 hover:border-rose-800/50 transition-colors text-[10px] font-bold uppercase tracking-wider"
              >
                <LogOut className="w-3 h-3" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            /* Logged-Out Login Bar Buttons */
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 hidden sm:inline text-[10px] uppercase tracking-wider font-mono">
                MEMBER SERVICE
              </span>

              <button
                id="topbar-signin-btn"
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white hover:bg-[#FF4D00] text-black font-black text-[11px] tracking-wider uppercase transition-all shadow-sm active:scale-95"
              >
                <LogIn className="w-3 h-3 text-black" />
                <span>로그인 (Sign In)</span>
              </button>

              <button
                id="topbar-signup-btn"
                type="button"
                onClick={onOpenLogin}
                className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#181818] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors text-[11px] font-bold tracking-wider uppercase"
              >
                <span>회원가입</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};
