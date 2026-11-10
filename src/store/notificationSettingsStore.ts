import { create } from 'zustand';

import { userApi } from '@/api/userApi';
import type { NotificationSettingsResponse } from '@/api/userApi';
import { useTermsStore } from './termsStore';

export type SettingKey = keyof NotificationSettingsResponse;
export type SettingsLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

const KEYS: SettingKey[] = ['pushEnabled', 'case', 'doc', 'pay', 'info', 'marketing'];
const NOT_SAVING: Record<SettingKey, boolean> = { pushEnabled: false, case: false, doc: false, pay: false, info: false, marketing: false };

type SettingsState = {
  status: SettingsLoadStatus;
  values: NotificationSettingsResponse | null;
  // 항목별 저장 중 표시. 저장 중인 항목은 다시 누를 수 없다.
  saving: Record<SettingKey, boolean>;
  fetchSettings: () => Promise<void>;
  // 누르는 즉시 새 값으로 보이고 그 항목만 저장한다. 실패하면 이전 값으로 되돌리고 false를 돌려준다.
  toggle: (key: SettingKey) => Promise<boolean>;
  reset: () => void;
};

// 요청이 겹칠 때 오래된 응답이 최신 값을 덮어쓰지 않도록, 그리고 로그아웃·화면 이탈 뒤에 도착한 응답을 버리기 위한 식별값
let requestSeq = 0;
let resetGeneration = 0;

// 서버 응답 6개를 적용하되, 지금 저장 중인 항목은 낙관적으로 바꾼 값을 그대로 둔다.
function applyServerValues(server: NotificationSettingsResponse, current: NotificationSettingsResponse | null, saving: Record<SettingKey, boolean>) {
  const next = { ...server };
  if (current) for (const key of KEYS) if (saving[key]) next[key] = current[key];
  return next;
}

// 알림 설정은 개인 정보라 메모리(zustand)에만 두고 저장소·로그에 남기지 않는다.
// 푸시 발송과 기기 토큰 등록은 서버 미연결이라 이번 범위에서 제외한다.
export const useNotificationSettingsStore = create<SettingsState>((set, get) => ({
  status: 'idle',
  values: null,
  saving: { ...NOT_SAVING },

  fetchSettings: async () => {
    const seq = ++requestSeq;
    // 이미 받아 둔 값이 있으면 다시 불러오는 동안에도 그대로 보여준다.
    if (get().status !== 'loaded') set({ status: 'loading' });
    try {
      const server = await userApi.getNotificationSettings();
      if (seq !== requestSeq) return;
      set((state) => ({ status: 'loaded', values: applyServerValues(server, state.values, state.saving) }));
    } catch {
      if (seq !== requestSeq) return;
      if (get().status !== 'loaded') set({ status: 'error' });
    }
  },

  toggle: async (key) => {
    const { values, saving } = get();
    if (!values || saving[key]) return true;

    const generation = resetGeneration;
    const previous = values[key];
    const next = !previous;
    set((state) => ({ values: state.values && { ...state.values, [key]: next }, saving: { ...state.saving, [key]: true } }));

    try {
      const server = await userApi.updateNotificationSettings({ [key]: next });
      if (generation !== resetGeneration) return true;
      // 이 저장보다 먼저 시작한 조회 응답이 늦게 와서 방금 값을 되돌리지 않게 한다.
      requestSeq += 1;
      set((state) => {
        const savingNow = { ...state.saving, [key]: false };
        return { values: applyServerValues(server, state.values, savingNow), saving: savingNow };
      });
      // 마케팅은 약관 동의 이력과 함께 처리되므로, 약관 화면용 기록이 이미 있으면 서버 값으로 다시 맞춘다.
      if (key === 'marketing' && useTermsStore.getState().status === 'loaded') void useTermsStore.getState().fetchAgreements();
      return true;
    } catch {
      if (generation !== resetGeneration) return false;
      requestSeq += 1;
      set((state) => ({ values: state.values && { ...state.values, [key]: previous }, saving: { ...state.saving, [key]: false } }));
      return false;
    }
  },

  reset: () => {
    resetGeneration += 1;
    requestSeq += 1;
    set({ status: 'idle', values: null, saving: { ...NOT_SAVING } });
  },
}));
