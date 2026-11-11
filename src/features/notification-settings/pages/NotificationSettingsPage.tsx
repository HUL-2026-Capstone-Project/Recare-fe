import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { ActionToast } from '@/features/case/components/ActionToast';
import { Card } from '@/features/home/components/Card';
import { useNotificationSettingsStore } from '@/store/notificationSettingsStore';
import type { SettingKey } from '@/store/notificationSettingsStore';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { BellIcon, InfoIcon } from '../components/icons';

// 시안의 문구. 아래 두 줄 설명 중 "계정·보안 …"과 마케팅 설명은 시안의 임시 문구다.
const CATEGORIES: { key: SettingKey; title: string; description: string }[] = [
  { key: 'case', title: '케이스 진행', description: '접수·심사·승인 등 단계가 바뀔 때' },
  { key: 'doc', title: '서류', description: '추가 서류 요청, 제출 마감 하루 전' },
  { key: 'pay', title: '보상금·지급', description: '지급 확정과 입금 완료 소식' },
  { key: 'info', title: '안내', description: '서비스 소식과 이용 안내' },
];

const SAVE_FAILED_MESSAGE = '변경하지 못했어요. 잠시 후 다시 시도해 주세요.';
const TOAST_DURATION_MS = 3000;

// 시안 NavHeader: 높이 52, 좌우 12, 왼쪽 40(뒤로가기), 가운데 제목, 오른쪽 빈 칸(minWidth 40 + 오른쪽 8). 아래 테두리 없음.
function Header() {
  return (
    <View className="flex-row items-center justify-between" style={{ height: 52, paddingHorizontal: 12, backgroundColor: '#fff' }}>
      <Pressable onPress={() => router.back()} accessibilityLabel="뒤로가기" className="items-center justify-center" style={{ width: 40 }}>
        <Image source={require('@/shared/assets/icons/chevron-left.png')} style={{ width: 24, height: 24 }} />
      </Pressable>
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>알림 설정</Text>
      {/* 시안은 minWidth 40에 오른쪽 8을 더해 48이다(RN은 padding이 너비에 포함되어 48로 쓴다). */}
      <View style={{ minWidth: 48 }} />
    </View>
  );
}

function Bar({ width, height = 14 }: { width: `${number}%`; height?: number }) {
  return <View style={{ height, width, borderRadius: 6, backgroundColor: colors.input }} />;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text2, letterSpacing: -0.2, marginTop: 0, marginHorizontal: 4, marginBottom: 8 }}>{children}</Text>
  );
}

function SettingRow({
  title,
  description,
  textDim,
  last,
  children,
}: {
  title: string;
  description: string;
  textDim?: boolean;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <View
      className="flex-row items-center"
      style={{ gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }}
    >
      <View style={{ flex: 1, minWidth: 0, opacity: textDim ? 0.4 : 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text1, letterSpacing: -0.3 }}>{title}</Text>
        <Text style={{ fontSize: 12, color: colors.text3, marginTop: 3, letterSpacing: -0.2, lineHeight: 12 * 1.4 }}>{description}</Text>
      </View>
      {children}
    </View>
  );
}

function Skeleton() {
  return (
    <>
      <Card style={{ borderRadius: 16, padding: 0, marginBottom: 20 }}>
        <View className="flex-row items-center" style={{ gap: 12, padding: 16 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.input }} />
          <View style={{ flex: 1, gap: 8 }}>
            <Bar width="30%" />
            <Bar width="80%" height={12} />
          </View>
        </View>
      </Card>
      <Card style={{ borderRadius: 16, padding: 0 }}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{ height: 62, paddingVertical: 14, paddingHorizontal: 16, gap: 8, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: colors.border }}
          >
            <Bar width="35%" />
            <Bar width="65%" height={12} />
          </View>
        ))}
      </Card>
    </>
  );
}

export default function NotificationSettingsPage() {
  const { top, bottom } = useSafeAreaInsets();
  const status = useNotificationSettingsStore((state) => state.status);
  const values = useNotificationSettingsStore((state) => state.values);
  const saving = useNotificationSettingsStore((state) => state.saving);
  const fetchSettings = useNotificationSettingsStore((state) => state.fetchSettings);
  const toggle = useNotificationSettingsStore((state) => state.toggle);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 화면이 보일 때마다 조회한다(값이 있으면 깜빡임 없이 조용히). 화면을 나가면 값을 비우고 늦게 도착한 응답도 버린다.
  useFocusEffect(
    useCallback(() => {
      fetchSettings();
    }, [fetchSettings])
  );
  useEffect(
    () => () => {
      useNotificationSettingsStore.getState().reset();
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const handleToggle = async (key: SettingKey) => {
    const ok = await toggle(key);
    if (ok) return;
    setToastMessage(SAVE_FAILED_MESSAGE);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
  };

  const pushOn = values?.pushEnabled ?? true;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <Header />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: bottom + 24 }}
      >
        {status === 'error' ? (
          <Card style={{ borderRadius: 16, padding: 0 }}>
            <View className="items-center" style={{ paddingTop: 28, paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text3, letterSpacing: -0.3 }}>불러오지 못했어요</Text>
              <Pressable onPress={fetchSettings} className="items-center justify-center" style={{ height: 44, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>다시 시도</Text>
              </Pressable>
            </View>
          </Card>
        ) : status !== 'loaded' || !values ? (
          <Skeleton />
        ) : (
          <>
            <Card style={{ borderRadius: 16, padding: 0, marginBottom: 20 }}>
              <View className="flex-row items-center" style={{ gap: 12, padding: 16 }}>
                <View className="items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryLight }}>
                  <BellIcon size={20} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1, letterSpacing: -0.4 }}>푸시 알림</Text>
                  <Text style={{ fontSize: 12, color: colors.text2, marginTop: 2, letterSpacing: -0.2, lineHeight: 12 * 1.4 }}>
                    끄면 푸시 알림만 꺼지고 알림함에는 계속 쌓여요
                  </Text>
                </View>
                <ToggleSwitch on={values.pushEnabled} disabled={saving.pushEnabled} onToggle={() => handleToggle('pushEnabled')} accessibilityLabel="푸시 알림" />
              </View>
            </Card>

            <SectionTitle>받을 알림</SectionTitle>
            <Card style={{ borderRadius: 16, padding: 0, marginBottom: 12 }}>
              {CATEGORIES.map((category, index) => (
                <SettingRow key={category.key} title={category.title} description={category.description} textDim={!pushOn} last={index === CATEGORIES.length - 1}>
                  <ToggleSwitch
                    on={values[category.key]}
                    disabled={!pushOn || saving[category.key]}
                    onToggle={() => handleToggle(category.key)}
                    accessibilityLabel={category.title}
                  />
                </SettingRow>
              ))}
            </Card>

            <View className="flex-row" style={{ gap: 8, paddingHorizontal: 4, marginBottom: 24 }}>
              <View style={{ marginTop: 2 }}>
                <InfoIcon size={14} />
              </View>
              <Text style={{ flex: 1, fontSize: 12, color: colors.text3, lineHeight: 12 * 1.5, letterSpacing: -0.2 }}>
                계정·보안 관련 알림은 설정과 상관없이 받아요
              </Text>
            </View>

            <SectionTitle>마케팅</SectionTitle>
            <Card style={{ borderRadius: 16, padding: 0 }}>
              <SettingRow title="마케팅 정보 수신" description="이벤트와 혜택 소식을 받아요. 언제든 끌 수 있어요" last>
                <ToggleSwitch on={values.marketing} disabled={saving.marketing} onToggle={() => handleToggle('marketing')} accessibilityLabel="마케팅 정보 수신" />
              </SettingRow>
            </Card>
          </>
        )}
      </ScrollView>

      <ActionToast message={toastMessage} sideMargin={20} />
    </View>
  );
}
