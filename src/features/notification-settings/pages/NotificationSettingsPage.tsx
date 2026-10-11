import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { BellIcon, InfoIcon } from '../components/icons';
import { NOTIFICATION_CATEGORIES } from '../mocks';

export default function NotificationSettingsPage() {
  const { top, bottom } = useSafeAreaInsets();
  const [pushOn, setPushOn] = useState(true);
  const [categoryState, setCategoryState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_CATEGORIES.map((c) => [c.key, c.defaultOn]))
  );

  const handleTogglePush = () => {
    setPushOn((prev) => {
      const next = !prev;
      // TODO: FCM 연동 — next===true면 POST /users/fcm(토큰 등록), next===false면 DELETE /users/deletefcm(토큰 삭제)
      return next;
    });
  };

  const handleToggleCategory = (key: string) => {
    if (!pushOn) return;
    // TODO: 카테고리별 알림 설정 저장 API 연동
    setCategoryState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <CaseDetailHeader title="알림 설정" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: Math.max(bottom, 24) }}
      >
        <Card style={{ padding: 0, marginBottom: 20 }}>
          <View className="flex-row items-center" style={{ gap: 12, padding: 16 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BellIcon size={20} />
            </View>
            <View className="flex-1" style={{ minWidth: 0 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1, letterSpacing: -0.4 }}>
                푸시 알림
              </Text>
              <Text style={{ fontSize: 12, color: colors.text2, marginTop: 2, letterSpacing: -0.2 }}>
                {pushOn ? '이 기기로 알림을 받고 있어요' : '알림을 받지 않아요'}
              </Text>
            </View>
            <ToggleSwitch on={pushOn} onToggle={handleTogglePush} />
          </View>
        </Card>

        <Text
          style={{ fontSize: 13, fontWeight: '700', color: colors.text2, letterSpacing: -0.2, marginHorizontal: 4, marginBottom: 8 }}
        >
          받을 알림
        </Text>
        <Card style={{ padding: 0, marginBottom: 14 }}>
          {NOTIFICATION_CATEGORIES.map((cat, index) => (
            <View
              key={cat.key}
              className="flex-row items-center"
              style={{
                gap: 12,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: index < NOTIFICATION_CATEGORIES.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <View className="flex-1" style={{ minWidth: 0 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: pushOn ? colors.text1 : colors.text3,
                    letterSpacing: -0.3,
                  }}
                >
                  {cat.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.text3, marginTop: 3, letterSpacing: -0.2, lineHeight: 16.8 }}>
                  {cat.description}
                </Text>
              </View>
              <ToggleSwitch
                on={categoryState[cat.key] && pushOn}
                disabled={!pushOn}
                onToggle={() => handleToggleCategory(cat.key)}
              />
            </View>
          ))}
        </Card>

        <View className="flex-row" style={{ gap: 8, paddingHorizontal: 4 }}>
          <View style={{ marginTop: 2 }}>
            <InfoIcon size={14} />
          </View>
          <Text style={{ flex: 1, fontSize: 12, color: colors.text3, lineHeight: 18, letterSpacing: -0.2 }}>
            푸시 알림을 끄면 이 기기에서 모든 알림이 오지 않아요. 알림 내역은 앱 안의 알림 탭에서 계속 볼 수 있어요.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
