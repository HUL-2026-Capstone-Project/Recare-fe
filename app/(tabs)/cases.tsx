import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

type FilterKey = '전체' | '진행 중' | '종결';

const FILTERS: { key: FilterKey; count: number }[] = [
  { key: '전체', count: 3 },
  { key: '진행 중', count: 2 },
  { key: '종결', count: 1 },
];

const CASES = [
  {
    id: '2024-0312',
    status: '심사 중',
    statusBg: colors.chip.orangeBg,
    statusFg: colors.chip.orangeFg,
    title: '산재 추가상병 요추염좌',
    date: '2024.01.15',
    step: 3,
    progressColor: colors.primary,
  },
  {
    id: '2024-0289',
    status: '접수 중',
    statusBg: colors.chip.blueBg,
    statusFg: colors.chip.blueFg,
    title: '우측 어깨 골절',
    date: '2023.11.22',
    step: 1,
    progressColor: colors.primary,
  },
  {
    id: '2023-0871',
    status: '승인·종결',
    statusBg: colors.chip.greenBg,
    statusFg: colors.chip.greenFg,
    title: '업무상 뇌출혈',
    date: '2023.08.04',
    step: 5,
    progressColor: colors.success,
  },
] as const;

export default function CasesScreen() {
  const { top } = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('전체');

  const filteredCases =
    selectedFilter === '전체'
      ? CASES
      : selectedFilter === '진행 중'
      ? CASES.filter(c => c.status !== '승인·종결')
      : CASES.filter(c => c.status === '승인·종결');

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
        >
          <Image
            source={require('../../assets/icons/plus-white.png')}
            style={{ width: 14, height: 14, tintColor: '#fff' }}
          />
          <Text className="text-white text-[13px] font-bold" style={{ letterSpacing: -0.3 }}>
            사건 등록하기
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 90 }}
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
                className="flex-row items-center px-3 py-1.5 rounded-full"
                style={{ backgroundColor: active ? colors.text1 : colors.input }}
              >
                <Text
                  className="text-[12px] font-semibold"
                  style={{
                    color: active ? '#fff' : colors.text2,
                    letterSpacing: -0.2,
                    lineHeight: 16,
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
          {filteredCases.map(c => (
            <View
              key={c.id}
              className="bg-white rounded-2xl p-4"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
            >
              {/* 케이스 번호 + 상태 배지 */}
              <View className="flex-row justify-between items-start mb-1.5">
                <Text
                  className="text-[11px] font-semibold"
                  style={{ color: colors.text3, letterSpacing: 0.3 }}
                >
                  CASE · {c.id}
                </Text>
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: c.statusBg }}
                >
                  <Text
                    className="text-[12px] font-semibold"
                    style={{ color: c.statusFg, letterSpacing: -0.2, lineHeight: 14 }}
                  >
                    {c.status}
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
                재해일 {c.date}
              </Text>

              {/* 프로그레스 바 */}
              <View className="flex-row gap-1 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: i < c.step ? c.progressColor : colors.border,
                    }}
                  />
                ))}
              </View>

              {/* 단계 + 자세히보기 */}
              <View className="flex-row justify-between items-center">
                <Text className="text-[12px]" style={{ letterSpacing: -0.2 }}>
                  <Text style={{ color: c.progressColor, fontWeight: '700' }}>{c.step}</Text>
                  <Text style={{ color: colors.text3 }}> / 5 단계</Text>
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push('/case-detail')}
                >
                  <Text
                    className="text-[13px] text-primary font-bold"
                    style={{ letterSpacing: -0.3 }}
                  >
                    자세히보기 ›
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute rounded-full bg-primary items-center justify-center"
        activeOpacity={0.85}
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
          source={require('../../assets/icons/plus-white.png')}
          style={{ width: 22, height: 22, tintColor: '#fff' }}
        />
      </TouchableOpacity>
    </View>
  );
}
