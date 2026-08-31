import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Send, 
  RotateCcw, 
  MapPin, 
  Heart, 
  DollarSign, 
  Utensils, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface AiSommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PROMPTS = [
  {
    title: '☔ 비 오는 날 을지로 노포 & 소주 코스',
    prompt: '비 오는 날 을지로 골목에서 친구들과 소주 한잔 기울이기 좋은 헤리티지 노포와 2차 코스를 짜줘',
    district: '종로 · 을지로',
    occasion: '친구 모임/술자리',
  },
  {
    title: '🍷 성수동 주말 데이트 & 와인바 코스',
    prompt: '성수동에서 실패 없는 점심 퓨전 한식/파스타 -> 감성 카페 -> 저녁 내추럴 와인바 데이트 코스 추천해줘',
    district: '성수 · 건대',
    occasion: '데이트/기념일',
  },
  {
    title: '🥢 서울 3대 평양냉면 차이점 & 입문 가이드',
    prompt: '우래옥, 필동면옥, 을지면옥 등 서울 대표 평양냉면들의 육수/면발 특징과 초보자 추천 코스를 알려줘',
    district: '종로 · 을지로',
    occasion: '미식 탐방',
  },
  {
    title: '👑 부모님 생신/가족 모임 강남 파인다이닝',
    prompt: '부모님 모시고 가기 좋은 강남/청담의 격식 있고 조용한 한정식이나 파인다이닝 추천해줘',
    district: '강남 · 압구정 · 청담',
    occasion: '가족 외식/부모님 모심',
  },
];

export const AiSommelierModal: React.FC<AiSommelierModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [prompt, setPrompt] = useState('');
  const [district, setDistrict] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseHtml, setResponseHtml] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendPrompt = async (customText?: string) => {
    const textToSend = customText || prompt;
    if (!textToSend.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResponseHtml(null);

    try {
      const res = await fetch('/api/ai/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          district: district || undefined,
          occasion: occasion || undefined,
          budget: budget || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('AI 소믈리에 추천을 불러오지 못했습니다.');
      }

      const data = await res.json();
      setResponseHtml(data.result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '추천 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_PROMPTS[0]) => {
    setPrompt(preset.prompt);
    setDistrict(preset.district);
    setOccasion(preset.occasion);
    handleSendPrompt(preset.prompt);
  };

  const handleReset = () => {
    setPrompt('');
    setDistrict('');
    setOccasion('');
    setBudget('');
    setResponseHtml(null);
    setErrorMsg(null);
  };

  return (
    <div 
      id="ai-sommelier-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="ai-sommelier-modal-container"
        className="relative w-full max-w-2xl bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-950/50">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-lg text-white">AI 서울 미식 소믈리에</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-stone-400">
                상황, 지역, 예산에 맞춰 서울 최고의 식당과 식도락 코스를 처방해 드립니다.
              </p>
            </div>
          </div>

          <button
            id="ai-sommelier-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          
          {/* Preset Prompts */}
          {!responseHtml && !loading && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                추천 질문 프리셋
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    id={`preset-prompt-btn-${idx}`}
                    onClick={() => handleApplyPreset(p)}
                    className="p-3 text-left rounded-xl bg-stone-800/80 hover:bg-stone-800 hover:border-amber-500/50 border border-stone-700/80 text-xs transition-all space-y-1 group"
                  >
                    <p className="font-bold text-amber-300 group-hover:text-amber-200">{p.title}</p>
                    <p className="text-[11px] text-stone-400 line-clamp-1">{p.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-500" />
                선호 권역
              </label>
              <input
                id="ai-filter-district"
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="예: 을지로, 성수동, 한남동"
                className="w-full px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" />
                모임 상황
              </label>
              <input
                id="ai-filter-occasion"
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="예: 소개팅, 회식, 혼밥, 부모님"
                className="w-full px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-500" />
                예산 / 취향
              </label>
              <input
                id="ai-filter-budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="예: 1인 3만원대, 가성비, 와인"
                className="w-full px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                id="ai-sommelier-prompt-input"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="어떤 서울 맛집이나 식도락 코스를 찾고 계신가요? 편하게 물어보세요..."
                className="w-full p-3.5 pr-12 bg-stone-800/90 border border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
              <button
                id="ai-sommelier-submit-btn"
                onClick={() => handleSendPrompt()}
                disabled={loading || !prompt.trim()}
                className="absolute right-3 bottom-3 p-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 text-center space-y-3 animate-pulse">
              <Bot className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
              <div className="space-y-1">
                <p className="font-bold text-amber-400 text-sm">서울 골목 데이터와 미식 노포 분석 중...</p>
                <p className="text-xs text-stone-400">맞춤형 메뉴, 웨이팅 팁, 이동 코스를 구성하고 있습니다.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Response Container */}
          {responseHtml && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  미식 소믈리에 맞춤 가이드
                </span>
                <button
                  id="ai-response-reset-btn"
                  onClick={handleReset}
                  className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  다시 질문하기
                </button>
              </div>

              <div className="bg-stone-950/80 p-5 rounded-2xl border border-stone-800/80 text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {responseHtml}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span>Powered by Google Gemini 3.7 Flash</span>
          <button
            id="ai-sommelier-bottom-close"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
