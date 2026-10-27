export type Hospital = {
  id: number;
  name: string;
  shortLabel: string;
  address: string;
  distance: string;
  latitude: number;
  longitude: number;
  designated: boolean;
  phone: string | null;
  specialty: string | null;
  // 서버가 준 현재 위치로부터의 거리(km). 없으면 null.
  distanceKm: number | null;
};
