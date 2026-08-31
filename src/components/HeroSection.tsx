import React from 'react';
import { Sparkles, Award, Utensils, Flame, MapPin, ChevronRight, Bot, Dices, Play, ExternalLink } from 'lucide-react';

interface HeroSectionProps {
  onSelectTag: (tag: string) => void;
  onOpenAiSommelier: () => void;
  onOpenRoulette: () => void;
  totalCount: number;
}

const POPULAR_TAGS = [
  '#평양냉면',
  '#짚불우대갈비',
  '#미슐랭2스타',
  '#성수동핫플',
  '#70년노포',
  '#칼국수맛집',
  '#24시간영업',
  '#내추럴와인',
  '#혼밥성지',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectTag,
  onOpenAiSommelier,
  onOpenRoulette,
  totalCount,
}) => {
  return (
    <section id="hero-section" className="relative overflow-hidden bg-stone-900 text-white border-b border-stone-800">
      
      {/* Background Graphic Patterns & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-600 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-rose-600 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Main Copy */}
          <div className="lg:col-span-8 space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>2026 서울 정통 미식 & 트렌드 큐레이션</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-stone-50">
              서울의 깊은 맛과 멋, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                진짜 맛집을 탐험하세요
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
              70년 역사를 이어온 골목 노포부터 미슐랭 스타 파인다이닝, 성수·을지로·한남의 핫플레이스까지. 
              검증된 시그니처 메뉴와 실시간 웨이팅 팁, 그리고 AI 소믈리에가 제안하는 맞춤형 식도락 코스를 만나보세요.
            </p>

            {/* Quick Action CTA Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-ai-btn"
                onClick={onOpenAiSommelier}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-orange-950/50 hover:shadow-orange-900/60 active:scale-95 transition-all"
              >
                <Bot className="w-4 h-4 text-amber-200" />
                <span>AI 소믈리에에게 식당 추천받기</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                id="hero-roulette-btn"
                onClick={onOpenRoulette}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 font-semibold text-sm active:scale-95 transition-all"
              >
                <Dices className="w-4 h-4 text-amber-400" />
                <span>오늘 뭐 먹지? 룰렛</span>
              </button>

              <a
                id="hero-youtube-btn"
                href="https://www.youtube.com/watch?v=alDHTkIphsM"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-md shadow-red-950/40 active:scale-95 transition-all border border-red-500/40"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>미식 탐방 영상</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Trending Keyword Tags */}
            <div className="pt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-400 font-medium mr-1">인기 키워드:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  id={`tag-btn-${tag.replace('#', '')}`}
                  onClick={() => onSelectTag(tag.replace('#', ''))}
                  className="px-2.5 py-1 rounded-full bg-stone-800/80 hover:bg-amber-600/30 hover:text-amber-300 text-stone-300 border border-stone-700/80 hover:border-amber-500/50 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Right Highlights & Stats Box */}
          <div className="lg:col-span-4">
            <div className="bg-stone-800/90 backdrop-blur border border-stone-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-stone-700 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Gourmet Standards
                </span>
                <span className="text-xs text-stone-400 font-mono">Seoul Edition</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                <div className="bg-stone-900/80 rounded-xl p-3.5 border border-stone-800">
                  <p className="text-xs text-stone-400 font-medium">엄선 대표 맛집</p>
                  <p className="text-2xl font-black text-amber-400 mt-1">{totalCount}+ <span className="text-xs font-normal text-stone-300">곳</span></p>
                </div>

                <div className="bg-stone-900/80 rounded-xl p-3.5 border border-stone-800">
                  <p className="text-xs text-stone-400 font-medium">미슐랭 & 블루리본</p>
                  <p className="text-2xl font-black text-rose-400 mt-1">100% <span className="text-xs font-normal text-stone-300">검증</span></p>
                </div>

                <div className="bg-stone-900/80 rounded-xl p-3.5 border border-stone-800">
                  <p className="text-xs text-stone-400 font-medium">노포 헤리티지</p>
                  <p className="text-2xl font-black text-orange-400 mt-1">1946~ <span className="text-xs font-normal text-stone-300">역사</span></p>
                </div>

                <div className="bg-stone-900/80 rounded-xl p-3.5 border border-stone-800">
                  <p className="text-xs text-stone-400 font-medium">서울 미식 권역</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">8개 <span className="text-xs font-normal text-stone-300">특화구</span></p>
                </div>

              </div>

              <div className="pt-2 space-y-2.5">
                <a
                  id="hero-youtube-card-link"
                  href="https://www.youtube.com/watch?v=alDHTkIphsM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2.5 text-xs text-stone-200 bg-gradient-to-r from-red-950/70 via-stone-900 to-stone-900 p-3 rounded-xl border border-red-800/40 hover:border-red-500/60 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-100 flex items-center gap-1.5">
                        <span>서울 미식 탐방 영상</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/90 text-white font-bold leading-none">YouTube</span>
                      </p>
                      <p className="text-[11px] text-stone-400">생생한 현장 리뷰 영상 보기</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-red-400 transition-colors shrink-0" />
                </a>

                <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>현장 웨이팅 팁 & 주차 정보 & 시그니처 가격 상시 업데이트</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
