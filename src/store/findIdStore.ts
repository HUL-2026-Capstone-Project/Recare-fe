import { create } from 'zustand';

import type { Account } from '@/api/authApi';

type FindIdState = {
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  reset: () => void;
};

// 아이디 찾기 결과를 FindIdPage → FindIdResultPage로 넘기기 위한 메모리 전용 스토어.
export const useFindIdStore = create<FindIdState>((set) => ({
  accounts: [],
  setAccounts: (accounts) => set({ accounts }),
  reset: () => set({ accounts: [] }),
}));
