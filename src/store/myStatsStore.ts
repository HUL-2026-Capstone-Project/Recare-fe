import { create } from 'zustand';

import { userApi } from '@/api/userApi';
import type { MyStatsResponse } from '@/api/userApi';

type MyStatsState = {
  stats: MyStatsResponse | null;
  fetchStats: () => Promise<void>;
  reset: () => void;
};

// 요청이 겹칠 때 오래된 응답이 최신 값을 덮어쓰지 않도록 요청 식별값을 둔다.
let requestSeq = 0;

// 통계는 개인정보라 메모리(zustand)에만 두고 저장소·로그에 남기지 않는다.
export const useMyStatsStore = create<MyStatsState>((set) => ({
  stats: null,

  fetchStats: async () => {
    const seq = ++requestSeq;
    try {
      const stats = await userApi.getMyStats();
      if (seq !== requestSeq) return;
      set({ stats });
    } catch {
      if (seq !== requestSeq) return;
      // 실패하면 이전 값을 남기지 않고 비워 마이페이지가 통계 영역을 그리지 않게 한다(오류 UI는 시안에 없음).
      set({ stats: null });
    }
  },

  reset: () => {
    requestSeq += 1;
    set({ stats: null });
  },
}));
