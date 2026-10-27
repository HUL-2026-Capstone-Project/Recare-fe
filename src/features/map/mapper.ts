import type { HospitalResponse } from '@/api/hospitalApi';
import type { Hospital } from './mocks';

function formatDistance(distanceKm: number | null | undefined): string {
  if (distanceKm == null) return '';
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)}m`;
  return `${distanceKm.toFixed(1)}km`;
}

// 좌표가 없는 병원은 지도 핀과 카메라 이동에 쓸 수 없어 호출하는 쪽에서 걸러낸다(hasCoordinates).
export function hasCoordinates(res: HospitalResponse): res is HospitalResponse & { latitude: number; longitude: number } {
  return res.latitude != null && res.longitude != null;
}

export function mapHospitalResponseToHospital(
  res: HospitalResponse & { latitude: number; longitude: number }
): Hospital {
  return {
    id: res.id,
    name: res.name,
    // 서버엔 지도 핀용 축약 이름 필드가 따로 없어(mock의 shortLabel처럼 수작업 축약이 아님) 길면 앞 6자만 쓴다.
    shortLabel: res.name.length > 6 ? `${res.name.slice(0, 6)}…` : res.name,
    address: res.address,
    distance: formatDistance(res.distance),
    latitude: res.latitude,
    longitude: res.longitude,
    designated: res.isDesignated,
    phone: res.phone ?? null,
    specialty: res.specialty ?? null,
    distanceKm: res.distance ?? null,
  };
}
