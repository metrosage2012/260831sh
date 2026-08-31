import React, { useState } from 'react';
import { Restaurant } from '../types';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Share2, 
  Check, 
  Star, 
  MapPin, 
  ExternalLink, 
  Utensils, 
  Calendar,
  ArrowRight
} from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Restaurant[];
  onRemoveWishlist: (r: Restaurant) => void;
  onClearWishlist: () => void;
  onSelectRestaurant: (r: Restaurant) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveWishlist,
  onClearWishlist,
  onSelectRestaurant,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShareItinerary = () => {
    if (wishlist.length === 0) return;
    
    let text = `[🍽️ 나의 서울 미식 투어 코스]\n\n`;
    wishlist.forEach((r, idx) => {
      text += `${idx + 1}. ${r.name} (${r.categoryLabel})\n`;
      text += `   - 위치: ${r.address} (${r.subway})\n`;
      text += `   - 추천메뉴: ${r.signatureMenus[0]?.name} (${r.signatureMenus[0]?.price})\n\n`;
    });
    text += `총 ${wishlist.length}곳 탐방 예정! #서울미식가이드`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="wishlist-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div 
        id="wishlist-drawer-container"
        className="w-full max-w-md bg-stone-900 text-stone-100 h-full shadow-2xl flex flex-col justify-between border-l border-stone-800 animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">나의 찜한 맛집 & 투어</h3>
              <p className="text-xs text-stone-400">저장된 식당 {wishlist.length}곳</p>
            </div>
          </div>

          <button
            id="wishlist-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-3">
              <Bookmark className="w-12 h-12 text-stone-700 stroke-[1.5]" />
              <div className="space-y-1">
                <p className="font-bold text-stone-300 text-sm">저장된 맛집이 없습니다</p>
                <p className="text-xs text-stone-500">
                  마음에 드는 식당의 북마크 아이콘을 눌러 나만의 서울 미식 투어 리스트를 만들어보세요!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Itinerary Guide Notice */}
              <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 text-xs text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  1일 식도락 코스 완성
                </p>
                <p className="text-[11px] text-amber-200/80">
                  저장된 식당 순서대로 점심, 카페, 저녁 코스로 활용해보세요.
                </p>
              </div>

              {/* Items List */}
              {wishlist.map((item, index) => (
                <div 
                  key={item.id}
                  id={`wishlist-item-${item.id}`}
                  className="bg-stone-800/80 rounded-2xl p-3.5 border border-stone-700/80 hover:border-amber-500/60 transition-all flex gap-3 group relative"
                >
                  {/* Step order badge */}
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0 cursor-pointer space-y-1" onClick={() => { onClose(); onSelectRestaurant(item); }}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/10">
                        {item.priceRange}
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 truncate">
                      {item.districtName} · {item.categoryLabel}
                    </p>

                    <div className="text-[11px] text-stone-300 font-medium truncate">
                      대표: {item.signatureMenus[0]?.name} ({item.signatureMenus[0]?.price})
                    </div>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    id={`wishlist-remove-${item.id}`}
                    onClick={() => onRemoveWishlist(item)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-700 transition-colors shrink-0 self-start"
                    title="목록에서 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            </div>
          )}

        </div>

        {/* Drawer Bottom Actions */}
        {wishlist.length > 0 && (
          <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-2 shrink-0">
            <div className="flex items-center gap-2">
              
              <button
                id="wishlist-share-itinerary-btn"
                onClick={handleShareItinerary}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? '코스 복사완료!' : '식도락 코스 텍스트 복사'}</span>
              </button>

              <button
                id="wishlist-clear-all-btn"
                onClick={onClearWishlist}
                className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-rose-400 text-xs font-semibold transition-colors"
                title="전체 비우기"
              >
                전체 비우기
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
