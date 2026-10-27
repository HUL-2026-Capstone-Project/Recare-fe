import { useCallback, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { useCaseStore } from '@/store/caseStore';
import { formatIsoDate } from '../caseMapper';
import { getStatusPresentation } from '../statusMapper';

type FilterKey = '전체' | '진행 중' | '종결';

export default function CasesScreen() {
  const { top } = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('전체');
  const cases = useCaseStore((state) => state.cases);
  const fetchCases = useCaseStore((state) => state.fetchCases);

  // 탭 화면은 마운트된 채로 남으므로 포커스될 때마다 목록을 새로 받는다.
  useFocusEffect(
    useCallback(() => {
      fetchCases();
    }, [fetchCases])
  );

  // 목록은 한 번만 받고 필터/개수는 서버가 준 progress.group 기준으로 앱에서 계산한다("진행 중" = ACTIVE, "종결" = CLOSED).
  const closedCases = cases.filter((c) => c.progress.group === 'CLOSED');
  const activeCases = cases.filter((c) => c.progress.group === 'ACTIVE');
  const FILTERS: { key: FilterKey; count: number }[] = [
    { key: '전체', count: cases.length },
    { key: '진행 중', count: activeCases.length },
    { key: '종결', count: closedCases.length },
  ];
  const filteredCases = selectedFilter === '전체' ? cases : selectedFilter === '진행 중' ? activeCases : closedCases;

  const handleRegisterCase = () => router.push({ pathname: '/case-form', params: { mode: 'create' } });

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      {/* 헤더 */}
      <View className="h-14 px-5 flex-row items-center justify-between">
        <Text className="text-[22px] font-extrabold text-text1" style={{ letterSpacing: -0.5 }}>
          내 케이스
        </Text>
        <TouchableOpacity
          className="h-9 px-3.5 rounded-full bg-primary flex-row items-center gap-1"
          activeOpacity={0.85}
          onPress={handleRegisterCase}
        >
          <Image
            source={require('@/shared/assets/icons/plus-white.png')}
            style={{ width: 14, height: 14, tintColor: '#fff' }}
          />
          <Text className="text-white text-[13px] font-bold" style={{ letterSpacing: -0.3 }}>
            케이스 등록
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 14, paddingBottom: 96 }}
      >
        {/* 필터 칩 */}
        <View className="flex-row gap-1.5 mb-4">
          {FILTERS.map(f => {
            const active = selectedFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setSelectedFilter(f.key)}
                activeOpacity={0.7}
                className="flex-row items-center justify-center px-3 rounded-full"
                style={{ height: 24, backgroundColor: active ? colors.text1 : colors.input }}
              >
                <Text
                  className="text-[12px] font-semibold"
                  style={{
                    color: active ? '#fff' : colors.text2,
                    letterSpacing: -0.2,
                  }}
                >
                  {f.key} {f.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 케이스 목록 */}
        <View className="gap-3">
          {filteredCases.map(c => {
            const presentation = getStatusPresentation(c.status, c.progress);
            return (
              <View
                key={c.id}
                className="bg-white p-4"
                style={{ borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
              >
                {/* 케이스 번호 + 상태 배지 */}
                <View className="flex-row justify-between items-start mb-3.5">
                  {c.caseNumber ? (
                    <Text
                      className="text-[11px] font-semibold"
                      style={{ color: colors.text3, letterSpacing: 0.3 }}
                    >
                      CASE · {c.caseNumber}
                    </Text>
                  ) : (
                    <View />
                  )}
                  <View
                    className="px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: presentation.badgeBg }}
                  >
                    <Text
                      className="text-[12px] font-semibold"
                      style={{ color: presentation.badgeFg, letterSpacing: -0.2, lineHeight: 14 }}
                    >
                      {presentation.label}
                    </Text>
                  </View>
                </View>

                {/* 제목 + 날짜 */}
                <Text
                  className="text-[16px] font-bold text-text1 mb-1"
                  style={{ letterSpacing: -0.3 }}
                >
                  {c.title}
                </Text>
                <Text
                  className="text-[12px] text-text2 mb-3"
                  style={{ letterSpacing: -0.2 }}
                >
                  재해일 {formatIsoDate(c.accidentDate)}
                </Text>

                {/* 프로그레스 바 — 단계와 전체 단계 수는 서버(progress) 값 */}
                <View className="flex-row gap-1 mb-3">
                  {Array.from({ length: presentation.totalSteps }).map((_, i) => (
                    <View
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: i < presentation.step ? presentation.progressColor : colors.border,
                      }}
                    />
                  ))}
                </View>

                {/* 단계 + 자세히보기 */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-[12px]" style={{ letterSpacing: -0.2 }}>
                    <Text style={{ color: presentation.progressColor, fontWeight: '700' }}>{presentation.step}</Text>
                    <Text style={{ color: colors.text3 }}> / {presentation.totalSteps} 단계</Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push(`/case-detail/${c.id}`)}
                  >
                    <Text
                      className="text-[13px] text-primary font-bold"
                      style={{ letterSpacing: -0.3 }}
                    >
                      상세보기 ›
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute rounded-full bg-primary items-center justify-center"
        activeOpacity={0.85}
        onPress={handleRegisterCase}
        style={{
          width: 56,
          height: 56,
          bottom: 20,
          right: 20,
          shadowColor: colors.primary,
          shadowOpacity: 0.4,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }}
      >
        <Image
          source={require('@/shared/assets/icons/plus-white.png')}
          style={{ width: 22, height: 22, tintColor: '#fff' }}
        />
      </TouchableOpacity>
    </View>
  );
}
