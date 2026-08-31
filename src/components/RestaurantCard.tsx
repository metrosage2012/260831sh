import React from 'react';
import { Restaurant, BadgeType } from '../types';
import { 
  Star, 
  MapPin, 
  Clock, 
  Bookmark, 
  ChevronRight, 
  Sparkles, 
  Award, 
  Building2, 
  Flame, 
  Heart, 
  User,
  Utensils,
  Camera
} from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (r: Restaurant) => void;
  isWishlisted: boolean;
  onToggleWishlist: (r: Restaurant) => void;
}

const renderBadgeIcon = (badge: BadgeType) => {
  switch (badge) {
    case 'michelin':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[11px] font-bold shadow-xs backdrop-blur-sm">
          <Award className="w-3 h-3" />
          미슐랭
        </span>
      );
    case 'blue_ribbon':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[11px] font-bold shadow-xs backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          블루리본
        </span>
      );
    case 'heritage':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-700/90 text-white text-[11px] font-bold shadow-xs backdrop-blur-sm">
          <Building2 className="w-3 h-3" />
          전통 노포
        </span>
      );
    case 'trendy':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/90 text-white text-[11px] font-bold shadow-xs backdrop-blur-sm">
          <Flame className="w-3 h-3" />
          핫플
        </span>
      );
    case 'romantic':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-600/90 text-white text-[11px] font-bold shadow-xs backdrop-blur-sm">
          <Heart className="w-3 h-3" />
          데이트
        </span>
      );
    case 'solo_friendly':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[11px] font-bold shadow-xs backdrop-blur-sm">
          <User className="w-3 h-3" />
          혼밥
        </span>
      );
    default:
      return null;
  }
};

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div 
      id={`restaurant-card-${restaurant.id}`}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-stone-800 hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelect(restaurant)}>
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Subtle Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

        {/* Badges on Top-Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {restaurant.badges.map((b) => (
            <React.Fragment key={b}>{renderBadgeIcon(b)}</React.Fragment>
          ))}
          {restaurant.heritageYear && (
            <span className="px-2 py-0.5 rounded-md bg-stone-900/80 text-amber-300 text-[11px] font-mono font-bold backdrop-blur-sm">
              Since {restaurant.heritageYear}
            </span>
          )}
        </div>

        {/* Wishlist Bookmark Button on Top-Right */}
        <button
          id={`wishlist-toggle-${restaurant.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(restaurant);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted 
              ? 'bg-rose-600 text-white shadow-md' 
              : 'bg-stone-900/60 text-stone-200 hover:text-white hover:bg-stone-900/90'
          }`}
          title={isWishlisted ? '찜 취소' : '나만의 맛집 목록에 추가'}
        >
          <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Real Review Photo Pill */}
        <div className="absolute bottom-11 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[10px] text-amber-300 font-semibold border border-amber-400/20 shadow-xs z-10">
          <Camera className="w-3 h-3 text-amber-400" />
          <span>실제 리뷰 사진</span>
        </div>

        {/* District & Category at Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{restaurant.districtName}</span>
            <span className="text-stone-300">· {restaurant.neighborhood}</span>
          </div>
          <div className="font-bold text-amber-300 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
            {restaurant.priceRange}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        
        <div className="space-y-2">
          
          {/* Rating, Reviews & Category */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-bold border border-amber-200/60">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
              <span className="text-stone-500">리뷰 {restaurant.reviewCount.toLocaleString()}개</span>
            </div>
            
            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
              {restaurant.categoryLabel}
            </span>
          </div>

          {/* Restaurant Main Name */}
          <div className="cursor-pointer" onClick={() => onSelect(restaurant)}>
            <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
              <span>{restaurant.name}</span>
            </h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">{restaurant.nameEn}</p>
          </div>

          {/* Summary */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {restaurant.summary}
          </p>

          {/* Signature Menus Highlight */}
          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-100 space-y-1 text-xs">
            <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-amber-600" />
              <span>대표 시그니처 메뉴</span>
            </div>
            <div className="flex items-center justify-between text-stone-800 font-medium">
              <span className="truncate pr-2">{restaurant.signatureMenus[0]?.name}</span>
              <span className="text-amber-700 font-bold shrink-0">{restaurant.signatureMenus[0]?.price}</span>
            </div>
          </div>

          {/* Subway info */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700">지하철:</span>
            <span className="truncate">{restaurant.subway}</span>
          </div>

        </div>

        {/* Bottom Card Action Footer */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          
          {/* Tags */}
          <div className="flex items-center gap-1 overflow-hidden">
            {restaurant.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 truncate">
                #{t}
              </span>
            ))}
          </div>

          {/* Detail Button */}
          <button
            id={`view-detail-btn-${restaurant.id}`}
            onClick={() => onSelect(restaurant)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>상세보기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </div>
  );
};
