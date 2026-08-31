import React, { useState } from 'react';
import { Restaurant, DistrictId } from '../types';
import { DISTRICTS } from '../data/restaurants';
import { X, Dices, Sparkles, Star, MapPin, ArrowRight, RotateCw, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RouletteModalProps {
  restaurants: Restaurant[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurant: (r: Restaurant) => void;
}

export const RouletteModal: React.FC<RouletteModalProps> = ({
  restaurants,
  isOpen,
  onClose,
  onSelectRestaurant,
}) => {
  const [filterDistrict, setFilterDistrict] = useState<DistrictId>('all');
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickedRestaurant, setPickedRestaurant] = useState<Restaurant | null>(null);
  const [tempDisplayIndex, setTempDisplayIndex] = useState(0);

  if (!isOpen) return null;

  const eligiblePool = filterDistrict === 'all' 
    ? restaurants 
    : restaurants.filter((r) => r.districtId === filterDistrict);

  const startSpin = () => {
    if (eligiblePool.length === 0) return;
    setIsSpinning(true);
    setPickedRestaurant(null);

    let counter = 0;
    const totalTicks = 28;
    const intervalTime = 80;

    const interval = setInterval(() => {
      setTempDisplayIndex((prev) => (prev + 1) % eligiblePool.length);
      counter++;

      if (counter >= totalTicks) {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * eligiblePool.length);
        const winner = eligiblePool[randomIndex];
        setPickedRestaurant(winner);
        setIsSpinning(false);

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#f43f5e', '#ec4899', '#3b82f6'],
        });
      }
    }, intervalTime);
  };

  return (
    <div 
      id="roulette-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="roulette-modal-card"
        className="relative w-full max-w-lg bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          id="roulette-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 shadow-lg shadow-orange-950/60 mb-1">
            <Dices className={`w-7 h-7 text-white ${isSpinning ? 'animate-spin' : ''}`} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            오늘 뭐 먹지? 서울 맛집 룰렛
          </h2>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            결정하기 힘든 날, 서울의 검증된 맛집 중 오늘의 운명적인 식당을 추천해 드립니다!
          </p>
        </div>

        {/* District Filter Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>탐색할 서울 권역 선택</span>
          </label>
          <select
            id="roulette-district-select"
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value as DistrictId)}
            disabled={isSpinning}
            className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.id !== 'all' ? `(${d.vibe})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Display Roulette Box */}
        <div className="relative min-h-[190px] bg-stone-950 rounded-2xl border border-stone-800 p-5 flex flex-col items-center justify-center text-center overflow-hidden">
          
          {isSpinning && (
            <div className="space-y-3 animate-pulse">
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <RotateCw className="w-4 h-4 animate-spin" />
                서울 맛집 탐색 중...
              </div>
              <div className="text-2xl font-black text-white">
                {eligiblePool[tempDisplayIndex]?.name || '식당 매칭 중...'}
              </div>
              <div className="text-xs text-stone-400">
                {eligiblePool[tempDisplayIndex]?.districtName} · {eligiblePool[tempDisplayIndex]?.categoryLabel}
              </div>
            </div>
          )}

          {!isSpinning && !pickedRestaurant && (
            <div className="space-y-2">
              <Sparkles className="w-8 h-8 text-amber-500/80 mx-auto" />
              <p className="text-sm font-bold text-stone-200">
                하단의 룰렛 돌리기 버튼을 눌러주세요!
              </p>
              <p className="text-xs text-stone-500">
                현재 후보군: {eligiblePool.length}개 식당
              </p>
            </div>
          )}

          {!isSpinning && pickedRestaurant && (
            <div className="space-y-3 w-full animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                오늘의 추천 맛집 당첨!
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {pickedRestaurant.name}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {pickedRestaurant.districtName} · {pickedRestaurant.categoryLabel} ({pickedRestaurant.priceRange})
                </p>
              </div>

              <p className="text-xs text-stone-300 line-clamp-2 px-2">
                {pickedRestaurant.summary}
              </p>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  id="roulette-view-winner-btn"
                  onClick={() => {
                    onClose();
                    onSelectRestaurant(pickedRestaurant);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>식당 상세보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            id="roulette-spin-btn"
            onClick={startSpin}
            disabled={isSpinning || eligiblePool.length === 0}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-orange-950/60 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? '룰렛 회전 중...' : pickedRestaurant ? '다시 돌리기' : '룰렛 돌리기!'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
