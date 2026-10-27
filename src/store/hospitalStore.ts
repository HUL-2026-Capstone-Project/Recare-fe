import { create } from 'zustand';

import { hospitalApi } from '@/api/hospitalApi';
import type { HospitalSearchParams } from '@/api/hospitalApi';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';
import type { Hospital } from '@/features/map/mocks';
import { hasCoordinates, mapHospitalResponseToHospital } from '@/features/map/mapper';

type HospitalStatus = 'idle' | 'loading' | 'success' | 'error';
type SearchParams = Omit<HospitalSearchParams, 'page'>;

type HospitalState = {
  hospitals: Hospital[];
  total: number;
  status: HospitalStatus;
  errorMessage: string | null;
  page: number;
  isLast: boolean;
  isLoadingMore: boolean;
  searchHospitals: (params: SearchParams) => Promise<void>;
  loadMoreHospitals: () => Promise<void>;
  reset: () => void;
};

// 요청이 겹칠 때 오래된 응답이 최신 결과를 덮어쓰지 않도록 쓰는 전역 요청 식별값.
// searchHospitals(새 검색)와 loadMoreHospitals(다음 페이지) 양쪽에서 공유한다.
let requestSeq = 0;
let lastSearchParams: SearchParams = {};

// 지도 화면 하나만 쓰는 데이터지만, 기존 도메인(auth/user/chat)과 같은 api+store 구조를 맞춘다.
export const useHospitalStore = create<HospitalState>((set, get) => ({
  hospitals: [],
  total: 0,
  status: 'idle',
  errorMessage: null,
  page: 0,
  isLast: false,
  isLoadingMore: false,

  searchHospitals: async (params) => {
    const seq = ++requestSeq;
    lastSearchParams = params;
    set({ status: 'loading', errorMessage: null });
    try {
      const res = await hospitalApi.searchHospitals({ ...params, page: 0 });
      if (seq !== requestSeq) return; // 이 사이 더 최신 검색/다음 페이지 요청이 있었으면 버린다
      set({
        hospitals: res.content.filter(hasCoordinates).map(mapHospitalResponseToHospital),
        total: res.totalElements,
        page: res.number,
        isLast: res.last,
        status: 'success',
      });
    } catch (e) {
      if (seq !== requestSeq) return;
      // TODO(디자인 필요): 지도 화면에 오류/빈 상태 UI가 시안에 없어 상태값만 남기고 화면은 바꾸지 않는다.
      set({ status: 'error', errorMessage: getErrorMessage(e as ApiError) });
    }
  },

  loadMoreHospitals: async () => {
    const { isLast, isLoadingMore, page } = get();
    if (isLast || isLoadingMore) return;

    const seq = ++requestSeq;
    set({ isLoadingMore: true });
    try {
      const res = await hospitalApi.searchHospitals({ ...lastSearchParams, page: page + 1 });
      if (seq !== requestSeq) return;
      set((state) => {
        const existingIds = new Set(state.hospitals.map((h) => h.id));
        const nextHospitals = res.content.filter(hasCoordinates).map(mapHospitalResponseToHospital).filter((h) => !existingIds.has(h.id));
        return {
          hospitals: [...state.hospitals, ...nextHospitals],
          total: res.totalElements,
          page: res.number,
          isLast: res.last,
          isLoadingMore: false,
        };
      });
    } catch {
      // TODO: 추가 페이지 요청이 실패하면 조용히 멈추고, 다음에 목록 끝에 닿을 때 다시 시도하게 한다.
      if (seq === requestSeq) set({ isLoadingMore: false });
    }
  },

  // 마지막 검색어·위치 좌표(lastSearchParams)까지 비운다. 진행 중이던 요청의 응답은 requestSeq로 버린다.
  reset: () => {
    requestSeq += 1;
    lastSearchParams = {};
    set({ hospitals: [], total: 0, status: 'idle', errorMessage: null, page: 0, isLast: false, isLoadingMore: false });
  },
}));
