import { create } from 'zustand';

import { notificationApi } from '@/api/notificationApi';
import type { Notification } from '@/features/notifications/types';
import { toNotification } from '@/features/notifications/mapper';

const PAGE_SIZE = 20;

// loading은 보여줄 목록이 없는 처음 로딩이다. 이미 받아 둔 목록이 있으면 다시 불러오는 동안에도 loaded로 둔다.
export type NotificationLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

type NotificationState = {
  items: Notification[];
  status: NotificationLoadStatus;
  page: number;
  totalPages: number;
  // 서버가 준 읽지 않은 알림 수. 읽음 처리하면 로컬에서 그만큼 줄인다.
  unreadCount: number;
  isLoadingMore: boolean;
  fetchFirstPage: () => Promise<void>;
  loadMore: () => Promise<void>;
  // 읽음 처리는 화면에 먼저 반영하고, 실패하면 이전 상태로 되돌린 뒤 false를 돌려준다. 이미 읽은 알림이거나 처리 중이면 true를 돌려주고 아무것도 하지 않는다.
  markRead: (id: string) => Promise<boolean>;
  markAllRead: () => Promise<boolean>;
  reset: () => void;
};

// 목록 새로고침·다음 페이지·reset(로그아웃) 뒤에 늦게 도착한 응답을 버리기 위한 요청 식별값
let listSeq = 0;
const pendingReads = new Set<string>();
let markingAll = false;
let resetGeneration = 0;

// 알림 내용은 개인 정보라 메모리(zustand)에만 두고 저장소·로그에 남기지 않는다.
export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  status: 'idle',
  page: 0,
  totalPages: 0,
  unreadCount: 0,
  isLoadingMore: false,

  fetchFirstPage: async () => {
    const seq = ++listSeq;
    if (get().status !== 'loaded') set({ status: 'loading' });
    set({ isLoadingMore: false });
    try {
      const res = await notificationApi.getNotifications({ page: 0, size: PAGE_SIZE });
      if (seq !== listSeq) return;
      set({
        items: res.items.map(toNotification),
        status: 'loaded',
        page: res.page,
        totalPages: res.totalPages,
        unreadCount: res.unreadCount,
      });
    } catch {
      if (seq !== listSeq) return;
      // 받아 둔 목록이 있으면 그대로 두고, 없을 때만 실패 상태로 둔다.
      if (get().status !== 'loaded') set({ status: 'error' });
    }
  },

  loadMore: async () => {
    const { status, page, totalPages, isLoadingMore } = get();
    if (status !== 'loaded' || isLoadingMore || page + 1 >= totalPages) return;

    const seq = ++listSeq;
    set({ isLoadingMore: true });
    try {
      const res = await notificationApi.getNotifications({ page: page + 1, size: PAGE_SIZE });
      if (seq !== listSeq) return;
      set((state) => {
        const known = new Set(state.items.map((item) => item.id));
        const next = res.items.map(toNotification).filter((item) => !known.has(item.id));
        return {
          items: [...state.items, ...next],
          page: res.page,
          totalPages: res.totalPages,
          unreadCount: res.unreadCount,
          isLoadingMore: false,
        };
      });
    } catch {
      // 실패하면 조용히 멈추고, 다음에 목록 끝에 닿을 때 다시 시도한다.
      if (seq === listSeq) set({ isLoadingMore: false });
    }
  },

  markRead: async (id) => {
    const target = get().items.find((item) => item.id === id);
    if (!target || target.read || pendingReads.has(id)) return true;

    const generation = resetGeneration;
    pendingReads.add(id);
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await notificationApi.markRead(Number(id));
      return true;
    } catch {
      if (generation === resetGeneration) {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, read: false } : item)),
          unreadCount: state.unreadCount + 1,
        }));
      }
      return false;
    } finally {
      pendingReads.delete(id);
    }
  },

  markAllRead: async () => {
    if (markingAll) return true;
    const generation = resetGeneration;
    const before = { items: get().items, unreadCount: get().unreadCount };
    markingAll = true;
    set((state) => ({ items: state.items.map((item) => (item.read ? item : { ...item, read: true })), unreadCount: 0 }));
    try {
      await notificationApi.markAllRead();
      return true;
    } catch {
      if (generation === resetGeneration) set(before);
      return false;
    } finally {
      markingAll = false;
    }
  },

  reset: () => {
    resetGeneration += 1;
    listSeq += 1;
    pendingReads.clear();
    markingAll = false;
    set({ items: [], status: 'idle', page: 0, totalPages: 0, unreadCount: 0, isLoadingMore: false });
  },
}));
