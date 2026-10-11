import { create } from 'zustand';

type ResetPasswordState = {
  // 비밀번호 찾기(본인 확인) → 새 비밀번호 입력 화면으로 resetToken을 넘기기 위한 메모리 전용 스토어.
  // 라우트 파라미터/URL에 넣지 않고 여기에만 보관한다.
  resetToken: string | null;
  setResetToken: (token: string) => void;
  clear: () => void;
};

export const useResetPasswordStore = create<ResetPasswordState>((set) => ({
  resetToken: null,
  setResetToken: (token) => set({ resetToken: token }),
  clear: () => set({ resetToken: null }),
}));
