import type { HospitalResponse } from '@/api/hospitalApi';
import type { Hospital } from './mocks';

function formatDistance(distanceKm: number | null): string {
  if (distanceKm == null) return '';
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)}m`;
  return `${distanceKm.toFixed(1)}km`;
}

export function mapHospitalResponseToHospital(res: HospitalResponse): Hospital {
  return {
    id: res.id,
    name: res.name,
    // 서버엔 지도 핀용 축약 이름 필드가 따로 없어(mock의 shortLabel처럼 수작업 축약이 아님) 길면 앞 6자만 쓴다.
    shortLabel: res.name.length > 6 ? `${res.name.slice(0, 6)}…` : res.name,
    address: res.address ?? '',
    distance: formatDistance(res.distance),
    latitude: res.latitude,
    longitude: res.longitude,
    designated: res.isDesignated ?? false,
    phone: res.phone,
  };
}
