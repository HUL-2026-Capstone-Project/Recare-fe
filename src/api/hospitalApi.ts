import { apiClient } from './client';

// 스웨거 기준: required(id, institutionCode, name, address, supportsCompensation, isDesignated)는 항상 값이 있고
// 나머지(좌표 포함)는 null일 수 있다.
export type HospitalResponse = {
  id: number;
  institutionCode: string;
  name: string;
  postalCode?: string | null;
  address: string;
  phone?: string | null;
  // 스웨거에 아직 남아 있는 쉼표로 이은 문자열. 앱은 specialties 배열을 쓴다.
  specialty?: string | null;
  specialties?: string[] | null;
  hospitalType?: string | null;
  supportsCompensation: boolean;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
  isDesignated: boolean;
};

export type PageHospitalResponse = {
  content: HospitalResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type HospitalSearchParams = {
  keyword?: string;
  isDesignated?: boolean;
  // 여러 개면 하나라도 맞는 병원(OR). 같은 이름으로 반복해 보낸다.
  specialty?: string[];
  hospitalType?: string[];
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  size?: number;
};

export const hospitalApi = {
  async searchHospitals(params: HospitalSearchParams = {}): Promise<PageHospitalResponse> {
    const { data } = await apiClient.get<PageHospitalResponse>('/api/v1/hospitals', {
      params,
      // 배열은 specialty[]=a 가 아니라 specialty=a&specialty=b 로 보낸다(스웨거 설명).
      paramsSerializer: { indexes: null },
    });
    return data;
  },

  // 목록 응답으로 현재 화면(카드/마커)에 필요한 정보가 충분해 화면에서는 아직 호출하지 않는다.
  async getHospital(id: number): Promise<HospitalResponse> {
    const { data } = await apiClient.get<HospitalResponse>(`/api/v1/hospitals/${id}`);
    return data;
  },
};
