import React, { useState, useEffect, useMemo } from 'react';
import { 
  Restaurant, 
  DistrictId, 
  CategoryId, 
  BadgeType, 
  PriceRange, 
  ReviewItem 
} from './types';
import { RESTAURANTS_DATA } from './data/restaurants';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { SeoulDistrictMap } from './components/SeoulDistrictMap';
import { RouletteModal } from './components/RouletteModal';
import { AiSommelierModal } from './components/AiSommelierModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AddReviewModal } from './components/AddReviewModal';
import { LoginBar, UserProfile } from './components/LoginBar';
import { LoginModal } from './components/LoginModal';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Compass, 
  Heart, 
  RotateCcw, 
  Award, 
  Building2, 
  MapPin, 
  Phone,
  Bot, 
  Dices,
  ChevronUp
} from 'lucide-react';

const STORAGE_WISHLIST_KEY = 'seoul_gourmet_wishlist_v1';
const STORAGE_REVIEWS_KEY = 'seoul_gourmet_reviews_v1';
const STORAGE_USER_KEY = 'seoul_gourmet_user_v1';

export default function App() {
  // Main Data States
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS_DATA);
  const [wishlist, setWishlist] = useState<Restaurant[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | 'all'>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceRange | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'heritage' | 'price_low' | 'price_high'>('rating');
  const [activeView, setActiveView] = useState<'grid' | 'map'>('grid');

  // Modal States
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isAiSommelierOpen, setIsAiSommelierOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [reviewModalTarget, setReviewModalTarget] = useState<Restaurant | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load saved wishlist, reviews & user from LocalStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedWishlist = localStorage.getItem(STORAGE_WISHLIST_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      const savedReviews = localStorage.getItem(STORAGE_REVIEWS_KEY);
      if (savedReviews) {
        const parsed = JSON.parse(savedReviews) as Record<string, ReviewItem[]>;
        setRestaurants((prev) =>
          prev.map((r) => {
            if (parsed[r.id]) {
              return { ...r, reviews: [...parsed[r.id], ...r.reviews] };
            }
            return r;
          })
        );
      }
    } catch (e) {
      console.error('LocalStorage load error', e);
    }
  }, []);

  // Track scroll position for floating back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save wishlist to LocalStorage
  const handleToggleWishlist = (r: Restaurant) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === r.id);
      let updated: Restaurant[];
      if (exists) {
        updated = prev.filter((item) => item.id !== r.id);
      } else {
        updated = [r, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleClearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(STORAGE_WISHLIST_KEY);
  };

  const handleRemoveWishlistItem = (r: Restaurant) => {
    handleToggleWishlist(r);
  };

  // Handle User Login and Logout
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  // Add User Review
  const handleSubmitReview = (restaurantId: string, newReview: ReviewItem) => {
    const newPhotoObj = newReview.photos && newReview.photos.length > 0 ? {
      id: `rev-photo-${newReview.id}`,
      url: newReview.photos[0],
      caption: newReview.content.slice(0, 50),
      author: newReview.author,
      date: newReview.date,
      menuName: newReview.recommendedMenu,
      rating: newReview.rating,
      source: 'receipt_verified' as const
    } : null;

    setRestaurants((prev) => {
      const updated = prev.map((r) => {
        if (r.id === restaurantId) {
          const newReviews = [newReview, ...r.reviews];
          const newCount = r.reviewCount + 1;
          const newRating = Math.min(5, ((r.rating * r.reviewCount) + newReview.rating) / newCount);
          const newReviewPhotos = newPhotoObj 
            ? [newPhotoObj, ...(r.reviewPhotos || [])]
            : r.reviewPhotos;
          return {
            ...r,
            reviews: newReviews,
            reviewPhotos: newReviewPhotos,
            reviewCount: newCount,
            rating: Number(newRating.toFixed(1)),
          };
        }
        return r;
      });

      // Update LocalStorage
      try {
        const savedReviews = localStorage.getItem(STORAGE_REVIEWS_KEY);
        const parsed = savedReviews ? JSON.parse(savedReviews) : {};
        parsed[restaurantId] = [newReview, ...(parsed[restaurantId] || [])];
        localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }

      return updated;
    });

    // Also update currently viewed modal restaurant if open
    if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
      setSelectedRestaurant((prev) => {
        if (!prev) return null;
        const newReviewPhotos = newPhotoObj 
          ? [newPhotoObj, ...(prev.reviewPhotos || [])]
          : prev.reviewPhotos;
        return {
          ...prev,
          reviews: [newReview, ...prev.reviews],
          reviewPhotos: newReviewPhotos,
          reviewCount: prev.reviewCount + 1,
        };
      });
    }
  };

  // Filter and Sort Logic
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q) || r.nameEn.toLowerCase().includes(q);
        const matchDistrict = r.districtName.toLowerCase().includes(q) || r.neighborhood.toLowerCase().includes(q);
        const matchSubway = r.subway.toLowerCase().includes(q);
        const matchTag = r.tags.some((t) => t.toLowerCase().includes(q));
        const matchMenu = r.signatureMenus.some((m) => m.name.toLowerCase().includes(q));
        const matchSummary = r.summary.toLowerCase().includes(q);

        if (!matchName && !matchDistrict && !matchSubway && !matchTag && !matchMenu && !matchSummary) {
          return false;
        }
      }

      // District Filter
      if (selectedDistrict !== 'all' && r.districtId !== selectedDistrict) {
        return false;
      }

      // Category Filter
      if (selectedCategory !== 'all' && r.categoryId !== selectedCategory) {
        return false;
      }

      // Badge Filter
      if (selectedBadge !== 'all' && !r.badges.includes(selectedBadge)) {
        return false;
      }

      // Price Filter
      if (selectedPrice !== 'all' && r.priceRange !== selectedPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'heritage':
          return (a.heritageYear || 9999) - (b.heritageYear || 9999);
        case 'price_low':
          return a.priceRange.length - b.priceRange.length;
        case 'price_high':
          return b.priceRange.length - a.priceRange.length;
        default:
          return 0;
      }
    });
  }, [restaurants, searchQuery, selectedDistrict, selectedCategory, selectedBadge, selectedPrice, sortBy]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedDistrict !== 'all' ||
    selectedCategory !== 'all' ||
    selectedBadge !== 'all' ||
    selectedPrice !== 'all'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setSelectedBadge('all');
    setSelectedPrice('all');
  };

  const handleSelectTag = (tag: string) => {
    setSearchQuery(tag);
    window.scrollTo({ top: 340, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      
      {/* Top Login Bar (Upper of Header) */}
      <LoginBar
        user={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
      />

      {/* Top Main Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenRoulette={() => setIsRouletteOpen(true)}
        onOpenAiSommelier={() => setIsAiSommelierOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Hero Banner Section */}
      <HeroSection
        onSelectTag={handleSelectTag}
        onOpenAiSommelier={() => setIsAiSommelierOpen(true)}
        onOpenRoulette={() => setIsRouletteOpen(true)}
        totalCount={restaurants.length}
      />

      {/* Sticky Interactive Filter Bar */}
      <FilterBar
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedBadge={selectedBadge}
        onSelectBadge={setSelectedBadge}
        selectedPrice={selectedPrice}
        onSelectPrice={setSelectedPrice}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalFilteredCount={filteredRestaurants.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* If Map View is active, render interactive map */}
        {activeView === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <SeoulDistrictMap
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              restaurants={restaurants}
            />
          </div>
        )}

        {/* Section Heading & Quick Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {selectedDistrict === 'all' ? '서울 전체 맛집 큐레이션' : `${restaurants.find(r => r.districtId === selectedDistrict)?.districtName} 맛집`}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                {filteredRestaurants.length}곳 탐색됨
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              미슐랭, 블루리본, 노포 헤리티지 및 핫플레이스 인증을 거친 검증된 맛집 리스트입니다.
            </p>
          </div>

          {/* Quick View Toggle (Mobile / Tablet) */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveView('grid')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'grid'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              카드 목록
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                activeView === 'map'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              권역 지도
            </button>
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-800">
                조건에 맞는 서울 맛집을 찾지 못했습니다
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                검색어를 변경하거나 활성화된 필터 조건을 초기화해보세요.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>전체 필터 초기화</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={(r) => setSelectedRestaurant(r)}
                isWishlisted={wishlist.some((w) => w.id === restaurant.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 flex items-center justify-center font-bold text-white text-sm">
                  서울
                </div>
                <span className="font-extrabold text-base text-white tracking-tight">서울 미식 가이드</span>
              </div>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                서울의 역사와 감성이 살아 숨 쉬는 골목 노포부터 세계적인 미슐랭 파인다이닝, 
                성수·을지로·한남의 트렌디한 미식 공간까지 엄선하여 소개하는 서울 대표 맛집 아카이브 플랫폼입니다.
              </p>
              <div className="pt-2 space-y-1 text-xs text-stone-300 border-t border-stone-800/80">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong className="text-stone-200">주소:</strong> 경기도 성남시 분당구 탄천로 215</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong className="text-stone-200">전화번호:</strong> <a href="tel:031-725-9300" className="hover:text-amber-400 transition-colors">031-725-9300</a></span>
                </div>
              </div>
              <div className="pt-1 flex items-center gap-3 text-stone-500">
                <span>© 2026 Seoul Gourmet Guide.</span>
                <span>Powered by Google Gemini</span>
              </div>
            </div>

            {/* Quick links 1 */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-200 text-xs uppercase tracking-wider">주요 미식 권역</h4>
              <ul className="space-y-1.5 text-stone-400">
                <li><button onClick={() => { setSelectedDistrict('jongno_euljiro'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors">종로 · 을지로 힙지로 노포</button></li>
                <li><button onClick={() => { setSelectedDistrict('seongsu_kondae'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors">성수 · 건대 핫플레이스</button></li>
                <li><button onClick={() => { setSelectedDistrict('gangnam_apgujeong'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors">강남 · 청담 파인다이닝</button></li>
                <li><button onClick={() => { setSelectedDistrict('yongsan_hannam'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors">용산 · 삼각지 짚불구이</button></li>
              </ul>
            </div>

            {/* Quick links 2 */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-200 text-xs uppercase tracking-wider">스마트 미식 도구</h4>
              <ul className="space-y-1.5 text-stone-400">
                <li><button onClick={() => setIsAiSommelierOpen(true)} className="hover:text-amber-400 transition-colors flex items-center gap-1"><Bot className="w-3.5 h-3.5" /> AI 미식 소믈리에 코스</button></li>
                <li><button onClick={() => setIsRouletteOpen(true)} className="hover:text-amber-400 transition-colors flex items-center gap-1"><Dices className="w-3.5 h-3.5" /> 오늘 뭐 먹지? 룰렛</button></li>
                <li><button onClick={() => setActiveView('map')} className="hover:text-amber-400 transition-colors flex items-center gap-1"><Compass className="w-3.5 h-3.5" /> 서울 인터랙티브 지도</button></li>
                <li><button onClick={() => setIsWishlistOpen(true)} className="hover:text-amber-400 transition-colors flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 나만의 식도락 투어 플래너</button></li>
              </ul>
            </div>

          </div>

        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          id="back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-stone-900 text-white shadow-xl hover:bg-amber-600 transition-all z-40 hover:scale-110 active:scale-95"
          title="맨 위로 이동"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Modals & Drawers */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        isWishlisted={Boolean(selectedRestaurant && wishlist.some((w) => w.id === selectedRestaurant.id))}
        onToggleWishlist={handleToggleWishlist}
        onOpenAddReview={(r) => setReviewModalTarget(r)}
      />

      <RouletteModal
        restaurants={restaurants}
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        onSelectRestaurant={(r) => setSelectedRestaurant(r)}
      />

      <AiSommelierModal
        isOpen={isAiSommelierOpen}
        onClose={() => setIsAiSommelierOpen(false)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={handleRemoveWishlistItem}
        onClearWishlist={handleClearWishlist}
        onSelectRestaurant={(r) => setSelectedRestaurant(r)}
      />

      <AddReviewModal
        restaurant={reviewModalTarget}
        isOpen={Boolean(reviewModalTarget)}
        onClose={() => setReviewModalTarget(null)}
        onSubmitReview={handleSubmitReview}
        defaultAuthor={currentUser?.name || ''}
      />

      {/* Login & Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
