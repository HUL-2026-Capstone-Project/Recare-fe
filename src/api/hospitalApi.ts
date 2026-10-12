import { apiClient } from './client';

export type HospitalResponse = {
  id: number;
  institutionCode: string | null;
  name: string;
  postalCode: string | null;
  address: string | null;
  phone: string | null;
  specialty: string | null;
  supportsCompensation: boolean | null;
  latitude: number;
  longitude: number;
  distance: number | null;
  // 스웨거 문서는 이 필드를 "designated"로 적어두었지만 실제 응답은 "isDesignated"로 내려온다(확인됨).
  isDesignated: boolean | null;
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
