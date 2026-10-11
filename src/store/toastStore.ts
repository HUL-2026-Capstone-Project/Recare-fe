import { create } from 'zustand';

type ToastState = {
  message: string | null;
  show: (message: string, durationMs?: number) => void;
  hide: () => void;
};

let hideTimer: ReturnType<typeof setTimeout> | null = null;

// 화면 전환 후(예: 비밀번호 변경 → 마이페이지)에도 잠깐 보여줄 토스트 메시지를 위한 메모리 전용 스토어.
export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message, durationMs = 3000) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message });
    hideTimer = setTimeout(() => set({ message: null }), durationMs);
  },
  hide: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message: null });
  },
}));
