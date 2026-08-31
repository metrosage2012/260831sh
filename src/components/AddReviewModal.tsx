import React, { useState } from 'react';
import { Restaurant, ReviewItem } from '../types';
import { X, Star, Send, MessageSquare, Camera, CheckCircle2 } from 'lucide-react';

interface AddReviewModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (restaurantId: string, review: ReviewItem) => void;
  defaultAuthor?: string;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onSubmitReview,
  defaultAuthor = '',
}) => {
  const [author, setAuthor] = useState(defaultAuthor);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommendedMenu, setRecommendedMenu] = useState('');
  const [content, setContent] = useState('');
  const [verifiedReceipt, setVerifiedReceipt] = useState(true);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');

  // Update author if defaultAuthor changes
  React.useEffect(() => {
    if (defaultAuthor) {
      setAuthor(defaultAuthor);
    }
  }, [defaultAuthor, isOpen]);

  // Set default photo choice if restaurant changes
  React.useEffect(() => {
    if (restaurant && restaurant.reviewPhotos && restaurant.reviewPhotos.length > 0) {
      setSelectedPhotoUrl(restaurant.reviewPhotos[0].url);
    } else if (restaurant) {
      setSelectedPhotoUrl(restaurant.image);
    }
  }, [restaurant, isOpen]);

  if (!isOpen || !restaurant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    const finalPhoto = customPhotoUrl.trim() || selectedPhotoUrl;
    const photos = finalPhoto ? [finalPhoto] : undefined;

    const newReview: ReviewItem = {
      id: `user-rev-${Date.now()}`,
      author: author.trim(),
      rating,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      content: content.trim(),
      recommendedMenu: recommendedMenu.trim() || undefined,
      verifiedReceipt,
      photos,
      photoCaption: content.trim().slice(0, 40)
    };

    onSubmitReview(restaurant.id, newReview);
    onClose();
    // Reset form
    setAuthor('');
    setContent('');
    setRecommendedMenu('');
    setRating(5);
    setCustomPhotoUrl('');
  };

  return (
    <div 
      id="add-review-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="add-review-modal-container"
        className="relative w-full max-w-md bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-white">
              방문자 실시간 포토 리뷰 작성
            </h3>
          </div>

          <button
            id="add-review-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Restaurant Summary */}
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs flex items-center justify-between">
          <div>
            <span className="text-stone-400">리뷰 대상: </span>
            <strong className="text-amber-400 font-bold">{restaurant.name}</strong>
          </div>
          <span className="text-[11px] text-stone-400">{restaurant.districtName}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Rating Stars Picker */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-300">별점 선택</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    id={`star-rating-btn-${star}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        filled ? 'fill-amber-400 text-amber-400' : 'text-stone-600'
                      }`} 
                    />
                  </button>
                );
              })}
              <span className="ml-2 font-bold text-amber-400 text-sm">{rating}점 / 5점</span>
            </div>
          </div>

          {/* Nickname Input */}
          <div className="space-y-1">
            <label className="font-bold text-stone-300">작성자 닉네임</label>
            <input
              id="review-author-input"
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="예: 을지로미식가, 성수동러버"
              className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Recommended Menu */}
          <div className="space-y-1">
            <label className="font-bold text-stone-300">가장 추천하는 메뉴 (선택)</label>
            <input
              id="review-recommended-menu-input"
              type="text"
              value={recommendedMenu}
              onChange={(e) => setRecommendedMenu(e.target.value)}
              placeholder="예: 우대갈비 + 볶음밥, 평양냉면"
              className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Review Photo Attachment */}
          <div className="space-y-2">
            <label className="font-bold text-stone-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>실제 리뷰 사진 첨부</span>
            </label>

            {/* Photo selector chips from restaurant's actual review photos */}
            {restaurant.reviewPhotos && restaurant.reviewPhotos.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-stone-400">매장 실제 리뷰 사진 선택:</span>
                <div className="grid grid-cols-3 gap-2">
                  {restaurant.reviewPhotos.map((rp, idx) => (
                    <div
                      key={rp.id || idx}
                      onClick={() => {
                        setSelectedPhotoUrl(rp.url);
                        setCustomPhotoUrl('');
                      }}
                      className={`relative h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedPhotoUrl === rp.url && !customPhotoUrl
                          ? 'border-amber-500 ring-2 ring-amber-500/40'
                          : 'border-stone-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={rp.url} alt={rp.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1">
                        <span className="text-[9px] text-white truncate">{rp.menuName || '사진'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Or custom photo URL */}
            <input
              id="review-custom-photo-url"
              type="url"
              value={customPhotoUrl}
              onChange={(e) => setCustomPhotoUrl(e.target.value)}
              placeholder="또는 직접 이미지 URL 입력 (https://...)"
              className="w-full px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-[11px]"
            />
          </div>

          {/* Verified Receipt Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer bg-stone-800/80 p-2.5 rounded-xl border border-stone-700">
            <input
              type="checkbox"
              checked={verifiedReceipt}
              onChange={(e) => setVerifiedReceipt(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 bg-stone-900 border-stone-600"
            />
            <div className="flex items-center gap-1 text-[11px] text-stone-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>실제 영수증 또는 결제 내역 인증 방문기</span>
            </div>
          </label>

          {/* Content Textarea */}
          <div className="space-y-1">
            <label className="font-bold text-stone-300">솔직한 방문 후기</label>
            <textarea
              id="review-content-input"
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="맛, 분위기, 웨이팅 시간 등 다른 방문자에게 도움이 되는 꿀팁을 남겨주세요!"
              className="w-full p-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            id="review-submit-btn"
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>사진 리뷰 등록하기</span>
          </button>

        </form>

      </div>
    </div>
  );
};
