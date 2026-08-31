import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Bookmark, 
  Dices, 
  Compass, 
  Search,
  Bot
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenRoulette: () => void;
  onOpenAiSommelier: () => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
  activeView: 'grid' | 'map';
  onViewChange: (view: 'grid' | 'map') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenRoulette,
  onOpenAiSommelier,
  onOpenWishlist,
  wishlistCount,
  activeView,
  onViewChange,
}) => {
  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 flex items-center justify-center shadow-md shadow-amber-900/30 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl font-bold text-white tracking-tighter">서울</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">서울 미식 가이드</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SEOUL GOURMET
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium hidden sm:block">
                미슐랭 · 블루리본 · 노포 헤리티지 & 핫플레이스
              </p>
            </div>
          </div>

          {/* Center Search bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="식당명, 메뉴(평양냉면, 우대갈비), 지하철역, 동네 검색..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-800/90 border border-stone-700 rounded-full text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  id="navbar-search-clear-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200 bg-stone-700/60 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* View Mode Toggle */}
            <div className="hidden lg:flex items-center p-1 bg-stone-800 rounded-lg border border-stone-700 text-xs">
              <button
                id="nav-view-grid-btn"
                onClick={() => onViewChange('grid')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeView === 'grid'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                리스트 뷰
              </button>
              <button
                id="nav-view-map-btn"
                onClick={() => onViewChange('map')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                  activeView === 'map'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                서울 지도
              </button>
            </div>

            {/* AI Sommelier Button */}
            <button
              id="nav-ai-sommelier-btn"
              onClick={onOpenAiSommelier}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-md shadow-orange-950/40 hover:brightness-110 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4 animate-pulse text-amber-200" />
              <span>AI 소믈리에</span>
            </button>

            {/* Roulette Button */}
            <button
              id="nav-roulette-btn"
              onClick={onOpenRoulette}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 hover:border-amber-500/40 active:scale-95 transition-all"
              title="오늘 뭐 먹지? 맛집 룰렛"
            >
              <Dices className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">오늘 뭐 먹지?</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="nav-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-stone-600 active:scale-95 transition-all flex items-center gap-1.5"
              title="찜한 맛집 목록"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">찜 목록</span>
              {wishlistCount > 0 && (
                <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-600 text-white leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="식당명, 메뉴, 지하철역, 동네 검색..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-800 border border-stone-700 rounded-full text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

      </div>
    </header>
  );
};
