import React, { useState } from 'react';
import { Restaurant, ReviewPhoto, ReviewItem } from '../types';
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Car, 
  Sparkles, 
  Bookmark, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Utensils, 
  MessageSquare, 
  Plus,
  Camera,
  CheckCircle2,
  ZoomIn,
  Image as ImageIcon
} from 'lucide-react';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (r: Restaurant) => void;
  onOpenAddReview: (r: Restaurant) => void;
}

interface ActiveLightboxPhoto {
  url: string;
  caption?: string;
  author?: string;
  date?: string;
  menuName?: string;
  rating?: number;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onOpenAddReview,
}) => {
  const [copied, setCopied] = useState(false);
  const [filterPhotoOnly, setFilterPhotoOnly] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<ActiveLightboxPhoto | null>(null);

  if (!restaurant) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(restaurant.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract all review photos (from reviewPhotos and from individual reviews)
  const allReviewPhotos: ReviewPhoto[] = [
    ...(restaurant.reviewPhotos || []),
    ...restaurant.reviews.flatMap((rev) => 
      (rev.photos || []).map((photoUrl, pIdx) => ({
        id: `rev-photo-${rev.id}-${pIdx}`,
        url: photoUrl,
        caption: rev.content.slice(0, 50) + (rev.content.length > 50 ? '...' : ''),
        author: rev.author,
        date: rev.date,
        menuName: rev.recommendedMenu,
        rating: rev.rating,
        source: 'receipt_verified' as const
      }))
    )
  ];

  // Remove duplicates by URL
  const uniqueReviewPhotos = Array.from(
    new Map(allReviewPhotos.map(item => [item.url, item])).values()
  );

  const displayedReviews = filterPhotoOnly
    ? restaurant.reviews.filter((r) => r.photos && r.photos.length > 0)
    : restaurant.reviews;

  const photoReviewsCount = restaurant.reviews.filter((r) => r.photos && r.photos.length > 0).length;

  return (
    <>
      <div 
        id="restaurant-detail-modal-backdrop"
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          id="restaurant-detail-modal-container"
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 text-stone-800 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Top Header with Image */}
          <div className="relative h-64 sm:h-72 w-full bg-stone-900 shrink-0">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

            {/* Close Button */}
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all z-20"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top-Left Wishlist Toggle */}
            <button
              id="modal-wishlist-toggle"
              onClick={() => onToggleWishlist(restaurant)}
              className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all z-20 ${
                isWishlisted
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-black/50 text-stone-200 hover:text-white hover:bg-black/80'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
              <span>{isWishlisted ? '찜 완료' : '나만의 맛집 저장'}</span>
            </button>

            {/* Real Review Photo Verified Badge */}
            <div className="absolute top-4 left-36 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold backdrop-blur-md z-20">
              <Camera className="w-3 h-3 text-emerald-400" />
              <span>실제 방문자 리뷰 사진</span>
            </div>

            {/* Header Info Overlay */}
            <div className="absolute bottom-4 left-5 right-5 text-white space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-600 text-white font-bold">
                  {restaurant.categoryLabel}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-stone-200">
                  {restaurant.districtName} · {restaurant.neighborhood}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-stone-900 font-bold">
                  {restaurant.priceRange} ({restaurant.priceEstimate})
                </span>
              </div>

              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                    {restaurant.name}
                  </h2>
                  <p className="text-xs text-stone-300 font-mono">{restaurant.nameEn}</p>
                </div>

                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-extrabold text-amber-400 text-base">{restaurant.rating.toFixed(1)}</span>
                  <span className="text-xs text-stone-300">({restaurant.reviewCount} 리뷰)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-sm">
            
            {/* Real Review Photo Gallery Section */}
            {uniqueReviewPhotos.length > 0 && (
              <div id="modal-review-photos-section" className="space-y-2.5 bg-gradient-to-br from-amber-50/60 to-stone-50 p-4 rounded-2xl border border-amber-200/70">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 flex items-center gap-1.5 text-base">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>실제 방문자 리뷰 사진 ({uniqueReviewPhotos.length})</span>
                  </h3>
                  <span className="text-xs text-stone-500 font-medium">클릭 시 확대 보기</span>
                </div>

                {/* Photo Thumbnails Horizontal Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {uniqueReviewPhotos.map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      onClick={() => setLightboxPhoto(photo)}
                      className="group relative h-28 sm:h-32 rounded-xl overflow-hidden cursor-pointer border border-stone-200 shadow-xs hover:shadow-md transition-all hover:scale-[1.02]"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                      
                      {/* Menu badge */}
                      {photo.menuName && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-amber-300 max-w-[85%] truncate">
                          {photo.menuName}
                        </div>
                      )}

                      {/* Zoom icon on hover */}
                      <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3 h-3" />
                      </div>

                      {/* Bottom Author & verified check */}
                      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                        <span className="font-semibold truncate max-w-[70%]">{photo.author}</span>
                        <div className="flex items-center text-amber-400 text-[10px]">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          <span className="ml-0.5 font-bold">{photo.rating || 5}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurant Story */}
            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <h3 className="font-bold text-stone-900 flex items-center gap-1.5 text-base">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>미식 스토리 & 헤리티지</span>
              </h3>
              <p className="text-stone-700 leading-relaxed text-xs sm:text-sm">
                {restaurant.story}
              </p>
            </div>

            {/* Signature Menus with prices & details */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-base flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  대표 시그니처 메뉴 ({restaurant.signatureMenus.length})
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {restaurant.signatureMenus.map((menu, idx) => (
                  <div 
                    key={idx}
                    className="bg-white p-3.5 rounded-xl border border-stone-200 hover:border-amber-400 shadow-xs space-y-1 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        {menu.isPopular && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-extrabold">
                            인기
                          </span>
                        )}
                        {menu.name}
                      </span>
                      <span className="font-extrabold text-amber-700 shrink-0">{menu.price}</span>
                    </div>
                    <p className="text-xs text-stone-500 leading-normal">{menu.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational & Visiting Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  영업 시간 & 브레이크타임
                </span>
                <p className="text-xs text-stone-700 font-medium">{restaurant.hours}</p>
                {restaurant.breakTime && (
                  <p className="text-[11px] text-stone-500">브레이크: {restaurant.breakTime}</p>
                )}
                {restaurant.holiday && (
                  <p className="text-[11px] text-rose-600 font-semibold">휴무: {restaurant.holiday}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-amber-700" />
                  주차 안내
                </span>
                <p className="text-xs text-stone-700">{restaurant.parking}</p>
              </div>

              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-amber-200/40">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  웨이팅 & 예약 필수 꿀팁
                </span>
                <p className="text-xs text-stone-700 bg-white/80 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                  {restaurant.reservationTip}
                </p>
              </div>

            </div>

            {/* Address, Location & Map Links */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>위치 및 길찾기 안내</span>
              </h3>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-stone-800 text-xs sm:text-sm">{restaurant.address}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{restaurant.subway}</p>
                  </div>

                  <button
                    id="copy-address-btn"
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '복사완료' : '주소 복사'}</span>
                  </button>
                </div>

                {/* Map Navigation Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(restaurant.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>네이버 지도</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://map.kakao.com/?q=${encodeURIComponent(restaurant.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#FEE500] hover:bg-[#ebd300] text-stone-900 font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>카카오맵</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' 서울')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* User Reviews Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span>방문자 리얼 리뷰 ({restaurant.reviews.length})</span>
                  </h3>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
                    <button
                      onClick={() => setFilterPhotoOnly(false)}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                        !filterPhotoOnly ? 'bg-white shadow-xs font-bold text-stone-900' : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      전체 ({restaurant.reviews.length})
                    </button>
                    <button
                      onClick={() => setFilterPhotoOnly(true)}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                        filterPhotoOnly ? 'bg-white shadow-xs font-bold text-amber-700' : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      <span>포토 리뷰 ({photoReviewsCount})</span>
                    </button>
                  </div>
                </div>

                <button
                  id="modal-add-review-btn"
                  onClick={() => onOpenAddReview(restaurant)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>리뷰 작성</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {displayedReviews.map((rev) => (
                  <div key={rev.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-800">{rev.author}</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {rev.verifiedReceipt && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            영수증 인증
                          </span>
                        )}
                      </div>
                      <span className="text-stone-400">{rev.date}</span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed">{rev.content}</p>

                    {/* Attached Review Photos */}
                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {rev.photos.map((photoUrl, pIdx) => (
                          <div 
                            key={pIdx}
                            onClick={() => setLightboxPhoto({
                              url: photoUrl,
                              caption: rev.content,
                              author: rev.author,
                              date: rev.date,
                              menuName: rev.recommendedMenu,
                              rating: rev.rating
                            })}
                            className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-stone-300 cursor-pointer shadow-xs hover:border-amber-500 transition-all hover:scale-105"
                          >
                            <img
                              src={photoUrl}
                              alt="리뷰 사진"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <ZoomIn className="w-4 h-4" />
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white px-1 py-0.5 text-center truncate">
                              방문자 사진
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {rev.recommendedMenu && (
                      <div className="text-[11px] text-amber-800 font-semibold bg-amber-100/60 px-2 py-0.5 rounded inline-block">
                        추천 메뉴: {rev.recommendedMenu}
                      </div>
                    )}
                  </div>
                ))}

                {displayedReviews.length === 0 && (
                  <div className="text-center py-6 text-stone-400 text-xs bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    해당 조건의 리뷰가 없습니다.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Modal Bottom Fixed Actions */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-stone-500">
              전화문의: <span className="font-semibold text-stone-800">{restaurant.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="modal-toggle-wishlist-bottom"
                onClick={() => onToggleWishlist(restaurant)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isWishlisted
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : 'bg-white border border-stone-300 hover:bg-stone-100 text-stone-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                <span>{isWishlisted ? '찜 취소' : '찜하기'}</span>
              </button>

              <button
                id="modal-close-bottom-btn"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white transition-colors"
              >
                닫기
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Photo Viewer Modal */}
      {lightboxPhoto && (
        <div 
          id="photo-lightbox-backdrop"
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              id="lightbox-close-btn"
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo */}
            <div className="relative max-h-[65vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption || '리뷰 사진 확대'}
                className="max-h-[65vh] w-full object-contain"
              />
            </div>

            {/* Caption & Metadata */}
            <div className="p-4 sm:p-5 text-white space-y-2 bg-stone-900 border-t border-stone-800 text-xs sm:text-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">{lightboxPhoto.author || '방문자'}</span>
                  {lightboxPhoto.rating && (
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: lightboxPhoto.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-[10px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    실제 방문 인증 사진
                  </span>
                </div>
                {lightboxPhoto.date && (
                  <span className="text-stone-400 text-xs">{lightboxPhoto.date} 방문</span>
                )}
              </div>

              {lightboxPhoto.menuName && (
                <div className="text-xs text-amber-300 font-bold">
                  메뉴: {lightboxPhoto.menuName}
                </div>
              )}

              {lightboxPhoto.caption && (
                <p className="text-stone-300 text-xs leading-relaxed">
                  "{lightboxPhoto.caption}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
