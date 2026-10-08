export type Hospital = {
  id: string;
  name: string;
  shortLabel: string;
  address: string;
  distance: string;
  latitude: number;
  longitude: number;
};

// 임시 mock 좌표 (강남역 일대로 분산). shortLabel은 지도 핀 캡션용 축약 이름.
// TODO: API 연동 시 교체
export const hospitals: Hospital[] = [
  {
    id: 'h1',
    name: '삼성서울정형외과의원',
    shortLabel: '삼성서울정형외과',
    address: '서울 강남구 테헤란로 123',
    distance: '0.8km',
    latitude: 37.5005,
    longitude: 127.0255,
  },
  {
    id: 'h2',
    name: '강남재활의학과',
    shortLabel: '강남재활',
    address: '서울 강남구 역삼로 45',
    distance: '1.2km',
    latitude: 37.5025,
    longitude: 127.0305,
  },
  {
    id: 'h3',
    name: '서울제일외과',
    shortLabel: '서울외과',
    address: '서울 강남구 봉은사로 88',
    distance: '1.5km',
    latitude: 37.4985,
    longitude: 127.0285,
  },
  {
    id: 'h4',
    name: '한사랑병원',
    shortLabel: '한사랑병원',
    address: '서울 강남구 논현로 52',
    distance: '1.5km',
    latitude: 37.4965,
    longitude: 127.0245,
  },
  {
    id: 'h5',
    name: '대한정형외과',
    shortLabel: '대한정형',
    address: '서울 강남구 삼성로 77',
    distance: '1.8km',
    latitude: 37.4975,
    longitude: 127.0325,
  },
];

export const mapMeta = { radius: '1km', total: 12 };

export const filterChips = ['산재 지정', '정형외과', '재활의학과', '야간진료'];
