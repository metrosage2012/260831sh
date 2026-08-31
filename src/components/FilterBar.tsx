import React from 'react';
import { 
  DistrictId, 
  CategoryId, 
  BadgeType, 
  PriceRange 
} from '../types';
import { DISTRICTS, CATEGORIES } from '../data/restaurants';
import { 
  Filter, 
  RotateCcw, 
  Award, 
  Sparkles, 
  Flame, 
  Heart, 
  User, 
  Building2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface FilterBarProps {
  selectedDistrict: DistrictId;
  onSelectDistrict: (id: DistrictId) => void;
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  selectedBadge: BadgeType | 'all';
  onSelectBadge: (b: BadgeType | 'all') => void;
  selectedPrice: PriceRange | 'all';
  onSelectPrice: (p: PriceRange | 'all') => void;
  sortBy: 'rating' | 'reviews' | 'heritage' | 'price_low' | 'price_high';
  onSortChange: (sort: 'rating' | 'reviews' | 'heritage' | 'price_low' | 'price_high') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}

const BADGE_OPTIONS: { id: BadgeType | 'all'; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'all', label: '전체 인증', icon: <Filter className="w-3.5 h-3.5" />, color: 'bg-stone-100 text-stone-700' },
  { id: 'michelin', label: '미슐랭 가이드', icon: <Award className="w-3.5 h-3.5 text-rose-600" />, color: 'bg-rose-50 text-rose-800 border-rose-200' },
  { id: 'blue_ribbon', label: '블루리본 서베이', icon: <Sparkles className="w-3.5 h-3.5 text-blue-600" />, color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { id: 'heritage', label: '30년+ 전통 노포', icon: <Building2 className="w-3.5 h-3.5 text-amber-700" />, color: 'bg-amber-50 text-amber-900 border-amber-200' },
  { id: 'trendy', label: '트렌디 핫플', icon: <Flame className="w-3.5 h-3.5 text-orange-600" />, color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { id: 'romantic', label: '데이트/기념일', icon: <Heart className="w-3.5 h-3.5 text-pink-600" />, color: 'bg-pink-50 text-pink-800 border-pink-200' },
  { id: 'solo_friendly', label: '혼밥 환영', icon: <User className="w-3.5 h-3.5 text-emerald-600" />, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedDistrict,
  onSelectDistrict,
  selectedCategory,
  onSelectCategory,
  selectedBadge,
  onSelectBadge,
  selectedPrice,
  onSelectPrice,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
  totalFilteredCount,
}) => {
  return (
    <div id="filter-bar-container" className="bg-white border-b border-stone-200 shadow-sm sticky top-16 sm:top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        
        {/* District Horizontal Scroll Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DISTRICTS.map((dist) => {
            const isSelected = selectedDistrict === dist.id;
            return (
              <button
                key={dist.id}
                id={`filter-district-${dist.id}`}
                onClick={() => onSelectDistrict(dist.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{dist.name}</span>
                {dist.id !== 'all' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-normal ${
                    isSelected ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {dist.vibe.split('&')[0].trim()}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Horizontal Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-stone-100 pt-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-category-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Badges, Price, Sort & Count controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-stone-100 text-xs">
          
          {/* Badge Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {BADGE_OPTIONS.map((badge) => {
              const isSelected = selectedBadge === badge.id;
              return (
                <button
                  key={badge.id}
                  id={`filter-badge-${badge.id}`}
                  onClick={() => onSelectBadge(badge.id)}
                  className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-sm'
                      : `${badge.color} border-stone-200 hover:border-stone-300`
                  }`}
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Price, Sort, Reset */}
          <div className="flex items-center gap-2 ml-auto">
            
            {/* Price Filter Selector */}
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
              {(['all', '₩', '₩₩', '₩₩₩', '₩₩₩₩'] as const).map((price) => {
                const isSelected = selectedPrice === price;
                return (
                  <button
                    key={price}
                    id={`filter-price-${price}`}
                    onClick={() => onSelectPrice(price)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {price === 'all' ? '가격 전체' : price}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="appearance-none pl-2.5 pr-7 py-1 bg-stone-100 border border-stone-200 rounded-lg text-stone-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="rating">평점 높은순 ★</option>
                <option value="reviews">리뷰 많은순</option>
                <option value="heritage">역사 깊은순 (노포)</option>
                <option value="price_low">가격 낮은순</option>
                <option value="price_high">가격 높은순</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                id="filter-reset-btn"
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                title="모든 필터 초기화"
              >
                <RotateCcw className="w-3 h-3" />
                <span>초기화</span>
              </button>
            )}

            {/* Filter Count Badge */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-stone-500 font-medium pl-1 border-l border-stone-200">
              <span>검색결과:</span>
              <strong className="text-amber-600 font-bold">{totalFilteredCount}</strong>
              <span>곳</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
