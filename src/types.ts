export type PriceRange = '₩' | '₩₩' | '₩₩₩' | '₩₩₩₩';

export type BadgeType = 
  | 'michelin' 
  | 'blue_ribbon' 
  | 'heritage' 
  | 'tv' 
  | 'trendy' 
  | 'solo_friendly' 
  | 'romantic';

export type DistrictId = 
  | 'all'
  | 'jongno_euljiro'
  | 'seongsu_kondae'
  | 'gangnam_apgujeong'
  | 'yongsan_hannam'
  | 'hongdae_yeonnam'
  | 'mapo_gongdeok'
  | 'jamsil_songpa'
  | 'yeouido_mullae';

export type CategoryId =
  | 'all'
  | 'korean_bbq'
  | 'gukbap_soup'
  | 'noodles'
  | 'hanjeongsik'
  | 'western_dining'
  | 'japanese_asian'
  | 'cafe_bakery'
  | 'street_pocha';

export interface SignatureMenu {
  name: string;
  nameEn?: string;
  price: string;
  description: string;
  isPopular?: boolean;
}

export interface ReviewPhoto {
  id: string;
  url: string;
  caption: string;
  author: string;
  date: string;
  menuName?: string;
  rating?: number;
  source?: 'receipt_verified' | 'google_review' | 'visitor';
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  recommendedMenu?: string;
  visitReason?: string;
  photos?: string[];
  photoCaption?: string;
  verifiedReceipt?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  nameEn: string;
  districtId: DistrictId;
  districtName: string;
  neighborhood: string;
  categoryId: CategoryId;
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  priceEstimate: string;
  address: string;
  subway: string;
  phone: string;
  image: string;
  gallery?: string[];
  reviewPhotos?: ReviewPhoto[];
  summary: string;
  story: string;
  tags: string[];
  badges: BadgeType[];
  heritageYear?: number;
  hours: string;
  breakTime?: string;
  holiday?: string;
  parking: string;
  reservationTip: string;
  signatureMenus: SignatureMenu[];
  atmosphere: string[];
  naverMapUrl?: string;
  kakaoMapUrl?: string;
  reviews: ReviewItem[];
}

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  nameEn: string;
  subname: string;
  description: string;
  accentColor: string;
  vibe: string;
  landmark: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
}
