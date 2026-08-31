import React from 'react';
import { DistrictId, Restaurant } from '../types';
import { DISTRICTS } from '../data/restaurants';
import { MapPin, Navigation, Sparkles, Compass } from 'lucide-react';

interface SeoulDistrictMapProps {
  selectedDistrict: DistrictId;
  onSelectDistrict: (id: DistrictId) => void;
  restaurants: Restaurant[];
}

interface MapNode {
  id: DistrictId;
  name: string;
  subname: string;
  x: number; // percentage from left
  y: number; // percentage from top
  color: string;
  vibe: string;
}

const MAP_NODES: MapNode[] = [
  { id: 'jongno_euljiro', name: '종로 · 을지로', subname: '노포 & 힙지로', x: 48, y: 32, color: 'bg-orange-500', vibe: '100년 전통' },
  { id: 'hongdae_yeonnam', name: '홍대 · 연남 · 망원', subname: '개성파 골목식당', x: 26, y: 38, color: 'bg-emerald-500', vibe: '젊음 & 감성' },
  { id: 'mapo_gongdeok', name: '마포 · 공덕', subname: '돼지갈비 & 설렁탕', x: 38, y: 46, color: 'bg-rose-500', vibe: '직장인 성지' },
  { id: 'yongsan_hannam', name: '용산 · 삼각지 · 한남', subname: '짚불구이 & 다이닝', x: 49, y: 50, color: 'bg-indigo-500', vibe: '용리단길 핫플' },
  { id: 'seongsu_kondae', name: '성수 · 건대', subname: '퓨전한식 & 베이커리', x: 68, y: 40, color: 'bg-pink-500', vibe: '서울의 브루클린' },
  { id: 'yeouido_mullae', name: '여의도 · 문래', subname: '콩국수 & 창작촌', x: 32, y: 58, color: 'bg-slate-600', vibe: '금융가 미식' },
  { id: 'gangnam_apgujeong', name: '강남 · 압구정 · 청담', subname: '파인다이닝 & 한우', x: 60, y: 64, color: 'bg-amber-500', vibe: '하이엔드 고메' },
  { id: 'jamsil_songpa', name: '잠실 · 송리단길', subname: '마제소바 & 디저트', x: 78, y: 62, color: 'bg-cyan-500', vibe: '석촌호수 데이트' },
];

export const SeoulDistrictMap: React.FC<SeoulDistrictMapProps> = ({
  selectedDistrict,
  onSelectDistrict,
  restaurants,
}) => {
  const getCount = (id: DistrictId) => {
    if (id === 'all') return restaurants.length;
    return restaurants.filter((r) => r.districtId === id).length;
  };

  return (
    <div id="seoul-district-map-container" className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">
              서울 인터랙티브 미식 지도
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            원하는 지역 핀을 클릭하면 해당 권역의 대표 맛집 목록이 즉시 필터링됩니다.
          </p>
        </div>

        {/* All District Reset */}
        <button
          id="map-select-all-btn"
          onClick={() => onSelectDistrict('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedDistrict === 'all'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          전체 서울 맛집 ({restaurants.length}곳)
        </button>
      </div>

      {/* SVG Canvas Map Container */}
      <div className="relative w-full h-[380px] sm:h-[460px] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-inner flex items-center justify-center p-4 select-none">
        
        {/* Ambient Map Glow */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Background Grid & Terrain Accents */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#666" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>

        {/* Han River (한강) Flow Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 0 54 Q 25 56, 42 50 T 65 48 T 85 55 T 100 52"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="opacity-40"
          />
          <path
            d="M 0 54 Q 25 56, 42 50 T 65 48 T 85 55 T 100 52"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.2"
            strokeDasharray="2 3"
            strokeLinecap="round"
            className="opacity-70 animate-pulse"
          />
        </svg>

        {/* North/South River Label */}
        <div className="absolute top-4 left-4 text-[10px] font-mono font-bold tracking-widest text-stone-400 bg-stone-900/80 px-2 py-1 rounded border border-stone-800">
          GANGBUK (강북)
        </div>
        <div className="absolute bottom-4 left-4 text-[10px] font-mono font-bold tracking-widest text-stone-400 bg-stone-900/80 px-2 py-1 rounded border border-stone-800">
          GANGNAM (강남)
        </div>
        
        {/* River Label */}
        <div className="absolute top-[48%] left-[7%] text-[10px] font-bold text-blue-400/80 tracking-wider flex items-center gap-1 pointer-events-none">
          <span>≋ 한강 (Han River)</span>
        </div>

        {/* Interactive District Pins */}
        {MAP_NODES.map((node) => {
          const isSelected = selectedDistrict === node.id;
          const count = getCount(node.id);

          return (
            <div
              key={node.id}
              id={`map-node-${node.id}`}
              onClick={() => onSelectDistrict(node.id)}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute cursor-pointer z-10 group"
            >
              {/* Pulse effect if selected */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-2xl bg-amber-500/30 animate-ping pointer-events-none" />
              )}

              {/* Pin Box */}
              <div
                className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xl shadow-amber-900/60 scale-110 border-2 border-white'
                    : 'bg-stone-900/90 text-stone-200 border border-stone-700 hover:border-amber-400 hover:bg-stone-800 hover:scale-105 shadow-md backdrop-blur-md'
                }`}
              >
                {/* Pin Header */}
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <span className={`w-2 h-2 rounded-full ${node.color} shrink-0`} />
                  <span className="whitespace-nowrap">{node.name}</span>
                </div>

                {/* Subtitle & Count */}
                <div className="flex items-center gap-1 text-[10px] mt-0.5 opacity-90">
                  <span className="hidden sm:inline font-normal">{node.subname.split('&')[0]}</span>
                  <span className={`px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {count}곳
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* Selected District Summary Card */}
      {selectedDistrict !== 'all' && (
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                {DISTRICTS.find((d) => d.id === selectedDistrict)?.name} 미식 권역
              </h4>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                {DISTRICTS.find((d) => d.id === selectedDistrict)?.vibe}
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {DISTRICTS.find((d) => d.id === selectedDistrict)?.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-stone-500">
              선택 권역 맛집: <strong className="text-amber-600 font-bold">{getCount(selectedDistrict)}곳</strong>
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
