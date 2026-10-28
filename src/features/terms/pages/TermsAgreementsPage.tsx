import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import type { TermsType } from '@/api/authApi';
import { colors } from '@/shared/constants/colors';
import { TERMS_ITEMS } from '@/features/auth/constants/terms';
import { formatEventDate } from '@/features/case/progressFormat';
import { ActionToast } from '@/features/case/components/ActionToast';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { Card } from '@/features/home/components/Card';
import { ChevronRightGray } from '@/features/my/components/icons';
import { useTermsStore } from '@/store/termsStore';
import { AgreeConfirmModal } from '../components/AgreeConfirmModal';
import { TERMS_DISPLAY_NAMES } from '../termsDisplay';

function SkeletonCard() {
  return (
    <Card style={{ borderRadius: 16, padding: 16 }}>
      <View style={{ gap: 10 }}>
        <View style={{ width: '60%', height: 14, borderRadius: 6, backgroundColor: colors.input }} />
        <View style={{ width: '40%', height: 14, borderRadius: 6, backgroundColor: colors.input }} />
      </View>
    </Card>
  );
}

function TermsCard({ termsType, required, agreedAt, onOpen, onAgree }: { termsType: TermsType; required: boolean; agreedAt: string | null; onOpen: () => void; onAgree: () => void }) {
  const agreed = agreedAt !== null;
  return (
    <Card style={{ borderRadius: 16, padding: 16 }}>
      {/* 눌리는 영역: 카드 안쪽 패딩 쪽으로 6씩 넓힌다(보이는 높이는 그대로). */}
      <Pressable onPress={onOpen} className="justify-center" style={{ minHeight: 44, marginTop: -6, marginBottom: agreed ? -6 : 0 }}>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>{TERMS_DISPLAY_NAMES[termsType]}</Text>
          <View style={{ height: 22, paddingHorizontal: 8, borderRadius: 11, justifyContent: 'center', backgroundColor: required ? colors.primaryLight : colors.input }}>
            <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: -0.2, color: required ? colors.primary : colors.text2 }}>{required ? '필수' : '선택'}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <ChevronRightGray size={16} />
        </View>
        {agreed ? (
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.success, letterSpacing: -0.2, marginTop: 6 }}>동의함 · {formatEventDate(agreedAt)}</Text>
        ) : (
          <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text3, letterSpacing: -0.2, marginTop: 6 }}>동의하지 않음</Text>
        )}
      </Pressable>
      {!agreed && (
        <Pressable onPress={onAgree} className="items-center justify-center" style={{ height: 44, marginTop: 12, borderRadius: 12, backgroundColor: colors.primary }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>동의하기</Text>
        </Pressable>
      )}
    </Card>
  );
}

export default function TermsAgreementsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const status = useTermsStore((state) => state.status);
  const agreements = useTermsStore((state) => state.agreements);
  const fetchAgreements = useTermsStore((state) => state.fetchAgreements);
  const agree = useTermsStore((state) => state.agree);

  const [confirmType, setConfirmType] = useState<TermsType | null>(null);
  const [agreeing, setAgreeing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 화면에 들어올 때 조회하고, 나가면 동의 기록을 메모리에서 비운다(늦게 도착한 응답도 reset이 버린다).
  useEffect(() => {
    fetchAgreements();
    return () => {
      useTermsStore.getState().reset();
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [fetchAgreements]);

  const openDetail = (termsType: TermsType) =>
    router.push({ pathname: '/terms-detail', params: { type: termsType, title: TERMS_DISPLAY_NAMES[termsType] } });

  const closeConfirm = () => {
    setConfirmType(null);
    setFailed(false);
  };

  const handleConfirm = useCallback(async () => {
    if (!confirmType || agreeing) return;
    setAgreeing(true);
    setFailed(false);
    const ok = await agree(confirmType);
    setAgreeing(false);
    if (!ok) {
      setFailed(true);
      return;
    }
    closeConfirm();
    setToastMessage('동의했어요');
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000);
  }, [confirmType, agreeing, agree]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <CaseDetailHeader title="약관 및 동의" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: Math.max(bottom, 24), gap: 12 }}
      >
        {status === 'error' ? (
          <Card style={{ borderRadius: 16, padding: 0 }}>
            <View className="items-center" style={{ paddingTop: 20, paddingBottom: 8, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text3, letterSpacing: -0.3, marginTop: 4 }}>불러오지 못했어요</Text>
              <Pressable onPress={fetchAgreements} className="items-center justify-center" style={{ height: 44, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>다시 시도</Text>
              </Pressable>
            </View>
          </Card>
        ) : status !== 'loaded' ? (
          TERMS_ITEMS.map((item) => <SkeletonCard key={item.termsType} />)
        ) : (
          // 카드 순서는 서버 응답 순서와 무관하게 항상 서비스, 개인정보, 마케팅이다.
          TERMS_ITEMS.map((item) => (
            <TermsCard
              key={item.termsType}
              termsType={item.termsType}
              required={item.required}
              agreedAt={agreements[item.termsType]}
              onOpen={() => openDetail(item.termsType)}
              onAgree={() => setConfirmType(item.termsType)}
            />
          ))
        )}
      </ScrollView>

      <ActionToast message={toastMessage} />
      {confirmType && (
        <AgreeConfirmModal
          title={`${TERMS_DISPLAY_NAMES[confirmType]}에 동의할까요?`}
          agreeing={agreeing}
          failed={failed}
          onCancel={closeConfirm}
          onConfirm={handleConfirm}
        />
      )}
    </View>
  );
}
