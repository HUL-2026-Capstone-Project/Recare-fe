import { create } from 'zustand';

import { hospitalApi } from '@/api/hospitalApi';
import type { HospitalSearchParams } from '@/api/hospitalApi';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';
import type { Hospital } from '@/features/map/mocks';
import { mapHospitalResponseToHospital } from '@/features/map/mapper';

type HospitalStatus = 'idle' | 'loading' | 'success' | 'error';

type HospitalState = {
  hospitals: Hospital[];
  total: number;
  status: HospitalStatus;
  errorMessage: string | null;
  searchHospitals: (params: HospitalSearchParams) => Promise<void>;
};

// 지도 화면 하나만 쓰는 데이터지만, 기존 도메인(auth/user/chat)과 같은 api+store 구조를 맞춘다.
export const useHospitalStore = create<HospitalState>((set) => ({
  hospitals: [],
  total: 0,
  status: 'idle',
  errorMessage: null,

  searchHospitals: async (params) => {
    set({ status: 'loading', errorMessage: null });
    try {
      const res = await hospitalApi.searchHospitals(params);
      set({
        hospitals: res.content.map(mapHospitalResponseToHospital),
        total: res.totalElements,
        status: 'success',
      });
    } catch (e) {
      // TODO(디자인 필요): 지도 화면에 오류/빈 상태 UI가 시안에 없어 상태값만 남기고 화면은 바꾸지 않는다.
      set({ status: 'error', errorMessage: getErrorMessage(e as ApiError) });
    }
  },
}));
