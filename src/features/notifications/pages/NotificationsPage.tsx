import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { useNotificationStore } from '@/store/notificationStore';
import { ActionToast } from '@/features/case/components/ActionToast';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { SectionEmpty, SectionError, SectionSkeleton } from '@/features/case/components/CaseSectionParts';
import { NotificationItem } from '../components/NotificationItem';

export default function NotificationsPage() {
  const { top, bottom } = useSafeAreaInsets();
  const items = useNotificationStore((state) => state.items);
  const status = useNotificationStore((state) => state.status);
  const isLoadingMore = useNotificationStore((state) => state.isLoadingMore);
  const fetchFirstPage = useNotificationStore((state) => state.fetchFirstPage);
  const loadMore = useNotificationStore((state) => state.loadMore);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 화면에 들어올 때마다 첫 페이지를 다시 받는다(받아 둔 목록이 있으면 그대로 보여주면서).
  useEffect(() => {
    fetchFirstPage();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [fetchFirstPage]);

  const showFailureToast = () => {
    setToastMessage('변경하지 못했어요. 잠시 후 다시 시도해 주세요.');
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePressItem = async (id: string) => {
    if (!(await markRead(id))) showFailureToast();
  };

  const handleMarkAll = async () => {
    if (!(await markAllRead())) showFailureToast();
  };

  // 목록이 비어 있을 때만 상태별 화면을 보여준다(처음 로딩 / 실패 / 알림 없음).
  const empty =
    status === 'error' ? (
      <View className="px-5" style={{ paddingTop: 12 }}>
        <SectionError onRetry={fetchFirstPage} />
      </View>
    ) : status === 'loaded' ? (
      <View className="px-5" style={{ paddingTop: 12 }}>
        <SectionEmpty text="받은 알림이 없어요" />
      </View>
    ) : (
      <View className="px-5" style={{ paddingTop: 12 }}>
        <SectionSkeleton />
      </View>
    );

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top, paddingBottom: bottom }}>
      <CaseDetailHeader
        title="알림"
        right={
          <Pressable onPress={handleMarkAll}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary, letterSpacing: -0.2 }}>
              전체 읽음
            </Text>
          </Pressable>
        }
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} onPress={() => handlePressItem(item.id)} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={empty}
        ListFooterComponent={isLoadingMore ? <ActivityIndicator color={colors.primary} style={{ paddingVertical: 16 }} /> : null}
      />
      <ActionToast message={toastMessage} />
    </View>
  );
}
