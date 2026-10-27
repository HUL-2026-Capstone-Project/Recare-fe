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
  specialty?: string | null;
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
  specialty?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  size?: number;
};

export const hospitalApi = {
  async searchHospitals(params: HospitalSearchParams = {}): Promise<PageHospitalResponse> {
    const { data } = await apiClient.get<PageHospitalResponse>('/api/v1/hospitals', { params });
    return data;
  },

  // 목록 응답으로 현재 화면(카드/마커)에 필요한 정보가 충분해 화면에서는 아직 호출하지 않는다.
  async getHospital(id: number): Promise<HospitalResponse> {
    const { data } = await apiClient.get<HospitalResponse>(`/api/v1/hospitals/${id}`);
    return data;
  },
};
