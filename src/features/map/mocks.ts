export type Hospital = {
  id: string;
  name: string;
  address: string;
  distance: string;
  active?: boolean;
};

export const hospitals: Hospital[] = [
  { id: 'h1', name: '삼성서울정형외과의원', address: '서울 강남구 테헤란로 123', distance: '0.8km', active: true },
  { id: 'h2', name: '강남재활의학과', address: '서울 강남구 역삼로 45', distance: '1.2km' },
  { id: 'h3', name: '서울제일외과', address: '서울 강남구 봉은사로 88', distance: '1.5km' },
];

export type MapPinData = {
  id: string;
  label: string;
  x: number;
  y: number;
  active?: boolean;
};

export const mapPins: MapPinData[] = [
  { id: 'p1', label: '삼성서울정형외과', x: 32, y: 34, active: true },
  { id: 'p2', label: '강남재활', x: 62, y: 28 },
  { id: 'p3', label: '서울외과', x: 48, y: 52 },
  { id: 'p4', label: '한사랑병원', x: 22, y: 62 },
  { id: 'p5', label: '대한정형', x: 74, y: 60 },
];

export const mapMeta = { radius: '1km', total: 12 };

export const filterChips = ['산재 지정', '정형외과', '재활의학과', '야간진료'];
